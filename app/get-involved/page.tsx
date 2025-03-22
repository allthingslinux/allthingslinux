'use client';

import { useState } from 'react';
import Link from 'next/link';
import { roles } from '@/data/forms/roles';
import { generalQuestions } from '@/data/forms/questions/general';
import { getRolesByDepartment } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { FormQuestion } from '@/types';

export default function GetInvolvedPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const rolesByDepartment = getRolesByDepartment(roles);

  // Filter out conditional "specify" questions that only appear if a specific option is selected
  const filterOutConditionalQuestions = (questions: FormQuestion[]) => {
    return questions.filter((question) => !question.showIf);
  };

  // Get the count of general questions that apply to all roles, excluding conditional ones
  const generalQuestionCount =
    filterOutConditionalQuestions(generalQuestions).length;

  // Filter roles based on search query
  const filteredDepartments = Object.entries(rolesByDepartment)
    .map(([department, departmentRoles]) => ({
      department,
      roles: departmentRoles.filter(
        (role) =>
          role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          role.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          department.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((dept) => dept.roles.length > 0);

  return (
    <div className="container mx-auto py-32 px-12">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Get Involved</h1>
        <p className="text-2xl text-muted-foreground">
          Join our community and make a difference. Find the perfect role that
          matches your skills and interests.
        </p>
      </div>

      <div className="max-w-md mx-auto mb-14">
        <Input
          type="search"
          placeholder="Search roles by title, department, or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-center text-md"
        />
      </div>

      <div className="space-y-12">
        {filteredDepartments.map(({ department, roles }) => {
          return (
            <div
              key={department}
              className="rounded-lg p-8 shadow-md border border-border/50 bg-card relative"
            >
              {/* Enhanced department header with role count */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4 w-full">
                  <h2 className="text-2xl font-semibold whitespace-nowrap">
                    {department}
                  </h2>
                  <div className="h-[1px] bg-border flex-grow hidden md:block"></div>
                </div>
                <Badge
                  variant="outline"
                  className="px-3 py-1 text-sm ml-4 whitespace-nowrap"
                >
                  {roles.length} {roles.length === 1 ? 'Role' : 'Roles'}
                </Badge>
              </div>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {roles.map((role) => (
                  <Link
                    key={role.slug}
                    href={`/apply/${role.slug}`}
                    className="block h-full"
                  >
                    <Card className="hover:ring-2 hover:ring-primary/20 transition-all duration-300 rounded-md h-full flex flex-col border-border/50 bg-background/60 backdrop-blur-sm">
                      <CardHeader>
                        <div className="flex justify-between items-start mb-2">
                          <CardTitle className="text-lg">{role.name}</CardTitle>
                          <Badge
                            variant="outline"
                            className="text-xs bg-background/60"
                          >
                            {department}
                          </Badge>
                        </div>
                        <CardDescription className="text-md text-muted-foreground mb-2">
                          {role.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="mt-auto pt-0">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">
                            {generalQuestionCount +
                              filterOutConditionalQuestions(role.questions)
                                .length}{' '}
                            questions total
                          </span>
                          <span className="text-sm font-medium text-primary">
                            Apply Now →
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}

        {filteredDepartments.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No roles found</h3>
            <p className="text-muted-foreground mt-2">
              Try adjusting your search query
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
