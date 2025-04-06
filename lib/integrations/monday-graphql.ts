import type { Role, FormData, Question } from '../types';
import { GraphQLClient, gql } from 'graphql-request';

// Define types for Monday.com API responses
interface MondayColumn {
  id: string;
  title: string;
  type: string;
  settings_str: string;
}

interface MondayBoardResponse {
  boards: Array<{
    columns: MondayColumn[];
  }>;
}

interface MondayItemResponse {
  id: string;
  name: string;
  board: {
    id: string;
    name: string;
  };
}

// Define types for Monday.com settings
interface MondayStatusLabel {
  color: string;
  border: string;
  var_name: string;
}

interface MondayDropdownOption {
  id: number;
  name: string;
}

interface MondayStatusSettings {
  done_colors: number[];
  labels: Record<string, string>;
  labels_colors: Record<string, MondayStatusLabel>;
}

interface MondayDropdownSettings {
  hide_footer: boolean;
  labels: MondayDropdownOption[];
}

/**
 * Creates a GraphQL client for Monday.com
 */
function createMondayClient(apiKey: string): GraphQLClient {
  // Use a more basic fetch-based configuration to avoid any compatibility issues
  const client = new GraphQLClient('https://api.monday.com/v2', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: apiKey,
    },
    // Avoid any Node.js specific features
    fetch: globalThis.fetch,
  });
  return client;
}

/**
 * Fetches board structure to get column IDs
 */
async function getMondayBoardStructure(
  client: GraphQLClient,
  boardId: string
): Promise<MondayColumn[] | null> {
  try {
    console.log('Fetching Monday.com board structure to get column IDs...');

    // Use the boards query to get columns with detailed settings
    const boardQuery = gql`
      query GetBoardColumns($boardId: [ID!]) {
        boards(ids: $boardId) {
          columns {
            id
            title
            type
            settings_str
          }
        }
      }
    `;

    const variables = {
      boardId: boardId,
    };

    const data = await client.request<MondayBoardResponse>(
      boardQuery,
      variables
    );
    console.log('Monday.com board structure:', JSON.stringify(data, null, 2));

    // Return the columns from the first board
    if (data.boards && data.boards.length > 0) {
      return data.boards[0].columns;
    }

    throw new Error('No board data found');
  } catch (error) {
    console.error('Error fetching Monday.com board structure:', error);
    return null;
  }
}

/**
 * Get appropriate value format for different column types
 */
function formatColumnValue(column: MondayColumn, value: unknown): unknown {
  if (!value && value !== 0) {
    return null;
  }

  switch (column.type) {
    case 'status':
      // Status columns need to use the index of the label in the settings
      try {
        const settings = JSON.parse(
          column.settings_str
        ) as MondayStatusSettings;
        // Parse the status settings properly - labels is an object, not an array
        if (settings && settings.labels) {
          const labels = settings.labels;
          // Find the status by name or use the first one (index 5 is "Needs Review" based on the logs)
          if (value && typeof value === 'string') {
            for (const [index, label] of Object.entries(labels)) {
              if (
                typeof label === 'string' &&
                label.toLowerCase() === value.toLowerCase()
              ) {
                return { index: parseInt(index, 10) };
              }
            }
          }

          // If "Needs Review" exists, use that (based on the logs, it's index 5)
          for (const [index, label] of Object.entries(labels)) {
            if (
              typeof label === 'string' &&
              label.toLowerCase() === 'needs review'
            ) {
              return { index: parseInt(index, 10) };
            }
          }

          // Default to the first status
          const firstIndex = Object.keys(labels)[0];
          return { index: parseInt(firstIndex, 10) };
        }
        return { index: 5 }; // Default to 5 which is "Needs Review" based on the logs
      } catch (e) {
        console.warn(`Failed to parse status settings for ${column.id}:`, e);
        return { index: 5 }; // Default to "Needs Review" based on the logs
      }

    case 'date':
      // Format date as ISO string without time part
      if (value instanceof Date) {
        return value.toISOString().split('T')[0];
      }
      return String(value);

    case 'long_text':
      // Ensure long text is properly formatted
      return { text: String(value) };

    case 'text':
      // Just return the text value
      return String(value);

    case 'dropdown':
      // Try to find the dropdown option
      try {
        const settings = JSON.parse(
          column.settings_str
        ) as MondayDropdownSettings;
        if (settings && settings.labels && Array.isArray(settings.labels)) {
          // Only proceed if value is defined and labels is an array
          if (value && typeof value === 'string') {
            const matchedOption = settings.labels.find(
              (option) =>
                option &&
                option.name &&
                option.name.toLowerCase() === value.toLowerCase()
            );

            if (matchedOption) {
              return { ids: [matchedOption.id] };
            }

            // If no match found, use the text approach to create a new option
            return { text: String(value) };
          }

          // Default to empty ids array
          return { ids: [] };
        }
        return { ids: [] };
      } catch (e) {
        console.warn(`Failed to parse dropdown settings for ${column.id}:`, e);
        return { ids: [] };
      }

    default:
      // Default handling for other column types
      return String(value);
  }
}

/**
 * Creates an item in Monday.com
 */
async function createMondayItem(
  client: GraphQLClient,
  boardId: string,
  itemName: string,
  columnValues: Record<string, unknown>
): Promise<string> {
  console.log('Creating Monday.com item...');

  const createItemMutation = gql`
    mutation CreateItem(
      $boardId: ID!
      $itemName: String!
      $columnValues: JSON!
    ) {
      create_item(
        board_id: $boardId
        item_name: $itemName
        column_values: $columnValues
      ) {
        id
        name
        board {
          id
          name
        }
      }
    }
  `;

  const variables = {
    boardId: boardId,
    itemName: itemName,
    columnValues: JSON.stringify(columnValues),
  };

  try {
    const data = await client.request<{ create_item: MondayItemResponse }>(
      createItemMutation,
      variables
    );
    console.log('Item created:', JSON.stringify(data, null, 2));
    return data.create_item.id;
  } catch (error) {
    console.error('Error creating Monday.com item:', error);
    throw error;
  }
}

/**
 * Adds application details directly to item instead of creating docs
 * (workaround for doc creation issues)
 */
async function addDetailsToItem(
  client: GraphQLClient,
  itemId: string,
  roleData: Role,
  formData: FormData,
  timestamp: string
): Promise<boolean> {
  try {
    console.log(
      'Adding application details as updates to the item instead of doc...'
    );

    // Create update mutation for adding comments
    const updateMutation = gql`
      mutation CreateUpdate($itemId: ID!, $body: String!) {
        create_update(item_id: $itemId, body: $body) {
          id
        }
      }
    `;

    // Create a single update with everything in it, using a format Monday.com can handle as one comment
    // Use a consistent format without too many line breaks
    const updateBody =
      `🔔 NEW APPLICATION RECEIVED - ${formData.discord_username}\n` +
      `Date: ${new Date(timestamp).toLocaleString()}\n\n` +
      `--- APPLICANT INFO ---\n` +
      `Discord: ${formData.discord_username}\n` +
      `Discord ID: ${formData.discord_id}\n\n` +
      `--- ROLE INFO ---\n` +
      `Role: ${roleData.name}\n` +
      `Department: ${roleData.department}\n` +
      `Description: ${roleData.description}\n\n` +
      `--- GENERAL QUESTIONS ---\n`;

    // Add general questions with minimal formatting
    const generalQuestions = roleData.generalQuestions
      .filter((q: Question) => formData[q.name])
      .map((q: Question) => `Q: ${q.question}\nA: ${formData[q.name]}`)
      .join('\n\n');

    // Add role-specific questions with minimal formatting
    const roleQuestions = roleData.questions
      .filter((q: Question) => formData[q.name])
      .map((q: Question) => `Q: ${q.question}\nA: ${formData[q.name]}`)
      .join('\n\n');

    // Combine everything into a single string with minimal line breaks
    const fullBody =
      updateBody +
      generalQuestions +
      '\n\n--- ROLE-SPECIFIC QUESTIONS ---\n' +
      roleQuestions;

    // Send a single update
    await client.request(updateMutation, {
      itemId,
      body: fullBody,
    });

    console.log('Successfully added application details as a single update');
    return true;
  } catch (error) {
    console.error('Error adding application details as update:', error);
    return false;
  }
}

/**
 * Stores application data in Monday.com using GraphQL Request
 */
export async function storeApplicationInMonday(
  roleData: Role,
  formData: FormData,
  timestamp: string
): Promise<boolean> {
  try {
    // Direct access to process.env
    const mondayApiKey = process.env.MONDAY_API_KEY;
    const boardId = process.env.MONDAY_BOARD_ID;

    if (!mondayApiKey || !boardId) {
      console.error(
        'Monday.com API key or board ID not configured, skipping integration'
      );
      return false;
    }

    console.log(
      'Attempting to store application in Monday.com using GraphQL Request...'
    );

    // Create GraphQL client
    const client = createMondayClient(mondayApiKey);

    // Get board structure to understand column IDs
    const columns = await getMondayBoardStructure(client, boardId);

    if (!columns || columns.length === 0) {
      console.error('Failed to get Monday.com board columns');
      return false;
    }

    // Log column mapping information for debugging
    console.log('Column mapping for reference:');
    columns.forEach((col: MondayColumn) => {
      console.log(`  ${col.id}: ${col.title} (${col.type})`);
    });

    // Log all form keys to help debug
    console.log('Form data keys:', Object.keys(formData));

    // Create a map of field mappings (title/description to column ID)
    const fieldToColumnMap: Record<string, MondayColumn> = {};

    // Standard fields we want to map by title or similar names
    const fieldMappings = [
      { field: 'name', titleMatches: ['name', 'title', 'applicant'] },
      {
        field: 'discord_username',
        titleMatches: ['discord username', 'discord name', 'discord user'],
      },
      { field: 'discord_id', titleMatches: ['discord id', 'discord user id'] },
      { field: 'status', titleMatches: ['status', 'application status'] },
      { field: 'department', titleMatches: ['department', 'team', 'group'] },
      { field: 'role', titleMatches: ['role', 'position', 'job title'] },
      {
        field: 'submission_date',
        titleMatches: ['date', 'submission date', 'applied on'],
      },
    ];

    // Map columns based on title matches
    for (const mapping of fieldMappings) {
      // Find column that matches any of the title options
      const matchedColumn = columns.find((col) =>
        mapping.titleMatches.some((match) =>
          col.title.toLowerCase().includes(match.toLowerCase())
        )
      );

      if (matchedColumn) {
        fieldToColumnMap[mapping.field] = matchedColumn;
      }
    }

    console.log(
      'Field to column mapping:',
      Object.entries(fieldToColumnMap).map(
        ([field, col]) => `${field} -> ${col.id} (${col.title})`
      )
    );

    // Map form data to Monday.com column values
    const columnValues: Record<string, unknown> = {};

    // Helper to set column value if we have a mapping for it
    const setColumnValue = (field: string, value: unknown) => {
      if (fieldToColumnMap[field] && value) {
        const column = fieldToColumnMap[field];
        columnValues[column.id] = formatColumnValue(column, value);
      }
    };

    // Set column values from the form data
    setColumnValue(
      'name',
      formData.preferred_name || formData.discord_username
    );
    setColumnValue('discord_username', formData.discord_username);
    setColumnValue('discord_id', formData.discord_id);
    setColumnValue('submission_date', new Date(timestamp));
    setColumnValue('status', 'Needs Review');
    setColumnValue('department', roleData.department);
    setColumnValue('role', roleData.name);

    // Fall back to using the actual column IDs if we couldn't find all mappings
    // Explicit mappings based on the board structure in the logs
    columnValues.name = formData.preferred_name || formData.discord_username;
    columnValues.text_mkp2jfrq = formData.discord_username; // Discord Username
    columnValues.text_mkp2d8wc = formData.discord_id; // Discord ID
    columnValues.date4 = new Date(timestamp).toISOString().split('T')[0]; // Date
    columnValues.color_mkp2nrgz = { index: 5 }; // Status - Needs Review (index 5)

    // Role & Department Columns - match against existing values by ID if possible
    console.log(`Setting role value: "${roleData.name}"`);

    // Find the Role dropdown column and check for existing options
    const roleColumn = columns.find((col) => col.id === 'dropdown_mkp22pcr');
    if (roleColumn) {
      try {
        const roleSettings = JSON.parse(
          roleColumn.settings_str
        ) as MondayDropdownSettings;
        if (
          roleSettings &&
          roleSettings.labels &&
          Array.isArray(roleSettings.labels)
        ) {
          // Try to find a case-insensitive match
          const matchedRole = roleSettings.labels.find(
            (option) =>
              option &&
              option.name &&
              option.name.toLowerCase() === roleData.name.toLowerCase()
          );

          if (matchedRole) {
            // Use the ID if we found a match
            console.log(
              `Found matching role ID ${matchedRole.id} for "${roleData.name}"`
            );
            columnValues.dropdown_mkp22pcr = { ids: [matchedRole.id] };
          } else {
            // Fall back to text approach if no match found
            console.log(
              `No matching role found for "${roleData.name}", using text approach`
            );
            columnValues.dropdown_mkp22pcr = { text: roleData.name };
          }
        }
      } catch (e) {
        console.warn(`Error parsing role dropdown settings:`, e);
        columnValues.dropdown_mkp22pcr = { text: roleData.name };
      }
    } else {
      columnValues.dropdown_mkp22pcr = { text: roleData.name };
    }

    // For department, do the same - try to match existing values
    console.log(`Setting department value: "${roleData.department}"`);

    // Find the Department dropdown column and check for existing options
    const deptColumn = columns.find((col) => col.id === 'dropdown_mkp2n3v9');
    if (deptColumn) {
      try {
        const deptSettings = JSON.parse(
          deptColumn.settings_str
        ) as MondayDropdownSettings;
        if (
          deptSettings &&
          deptSettings.labels &&
          Array.isArray(deptSettings.labels)
        ) {
          // Try to find a case-insensitive match
          const matchedDept = deptSettings.labels.find(
            (option) =>
              option &&
              option.name &&
              option.name.toLowerCase() === roleData.department.toLowerCase()
          );

          if (matchedDept) {
            // Use the ID if we found a match
            console.log(
              `Found matching department ID ${matchedDept.id} for "${roleData.department}"`
            );
            columnValues.dropdown_mkp2n3v9 = { ids: [matchedDept.id] };
          } else {
            // Fall back to text approach if no match found
            console.log(
              `No matching department found for "${roleData.department}", using text approach`
            );
            columnValues.dropdown_mkp2n3v9 = { text: roleData.department };
          }
        }
      } catch (e) {
        console.warn(`Error parsing department dropdown settings:`, e);
        columnValues.dropdown_mkp2n3v9 = { text: roleData.department };
      }
    } else {
      columnValues.dropdown_mkp2n3v9 = { text: roleData.department };
    }

    // Log the complete column mapping for debugging
    console.log(
      'Monday.com column values:',
      JSON.stringify(columnValues, null, 2)
    );

    // Create the item
    const itemName = `${formData.discord_username} - ${roleData.name}`;
    const itemId = await createMondayItem(
      client,
      boardId,
      itemName,
      columnValues
    );
    console.log(`Monday.com item created with ID: ${itemId}`);

    // Since doc creation is failing, use item updates instead
    const detailsAdded = await addDetailsToItem(
      client,
      itemId,
      roleData,
      formData,
      timestamp
    );

    if (detailsAdded) {
      console.log('Successfully stored application in Monday.com');
      return true;
    } else {
      console.warn('Created item but failed to add full details');
      return true; // Return true anyway since the main item was created
    }
  } catch (error) {
    console.error('Error storing application in Monday.com:', error);
    return false;
  }
}
