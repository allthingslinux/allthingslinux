'use client';

import { useState, useMemo, useCallback, memo } from 'react';
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
import { Search } from 'lucide-react';
import type { FormQuestion } from '@/types';
import type { Role } from '@/types';

// Helper to filter out conditional questions
const filterOutConditionalQuestions = (questions: FormQuestion[]) => {
  return questions.filter((question) => !question.showIf);
};

const Hero = memo(({ roleCount }: { roleCount: number }) => (
  <div className="relative overflow-hidden rounded-xl border border-primary/10 mb-8 sm:mb-10 md:mb-12">
    {/* Grid pattern background */}
    <div className="absolute inset-0 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>

    <div className="relative py-16 sm:py-20 md:py-24 px-6 sm:px-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center space-x-1 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-primary/20 backdrop-blur-sm">
            <span className="text-primary">Opportunities</span>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-6">
          Apply
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-center text-muted-foreground mb-8">
          Join our team and make a difference. Find the perfect role that
          matches your skills and interests.
        </p>

        {/* Role stats with minimal tag style */}
        <div className="flex flex-wrap justify-center gap-y-2 gap-x-1 mb-10">
          <span className="inline-flex items-center font-mono text-sm py-1 px-3 rounded-full bg-primary text-primary-foreground">
            <span className="animate-pulse text-primary-foreground/80">■</span>
            <span className="ml-2 font-medium">{roleCount}+ open roles</span>
          </span>

          <span className="inline-flex items-center font-mono text-sm py-1 px-3">
            •
          </span>

          <span className="inline-flex items-center font-mono text-sm py-1 px-3 rounded-full border border-blue-500/20 text-blue-400">
            remote
          </span>

          <span className="inline-flex items-center font-mono text-sm py-1 px-3 rounded-full border border-orange-500/20 text-orange-400">
            timezone flexible
          </span>

          <span className="inline-flex items-center font-mono text-sm py-1 px-3 rounded-full border border-green-500/20 text-green-400">
            volunteer
          </span>
        </div>
      </div>
    </div>
  </div>
));
Hero.displayName = 'Hero';

// Search component
const SearchInput = memo(
  ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (value: string) => void;
  }) => {
    const handleClear = useCallback(() => onChange(''), [onChange]);

    return (
      <div className="max-w-2xl mx-auto mt-8 sm:mt-10 md:mt-12 mb-8 sm:mb-10 md:mb-12">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50 z-10" />

          <Input
            type="text"
            placeholder="Search roles..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-full px-4 pl-12 py-6 bg-transparent text-base focus-visible:ring-0 focus-visible:ring-offset-0"
          />

          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-muted-foreground/80 p-1.5 z-10"
              aria-label="Clear search"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <title>Clear search</title>
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    );
  }
);
SearchInput.displayName = 'SearchInput';

// Role card component - memoized to avoid re-renders when other cards change
const RoleCard = memo(
  ({
    role,
    department,
    generalQuestionCount,
  }: {
    role: Role;
    department: string;
    generalQuestionCount: number;
  }) => {
    // Count total questions for this role - memoized since it's a computation
    const totalQuestions = useMemo(() => {
      const roleQuestionCount = filterOutConditionalQuestions(
        role.questions
      ).length;
      return generalQuestionCount + roleQuestionCount;
    }, [role.questions, generalQuestionCount]);

    return (
      <Link href={`/apply/${role.slug}`} className="block h-full">
        <Card className="hover:ring-2 hover:ring-primary/20 transition-all duration-300 rounded-md h-full flex flex-col border-border/50 bg-background/60 backdrop-blur-sm">
          <CardHeader className="p-3 sm:p-4 md:p-6">
            <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
              <CardTitle className="text-base sm:text-lg">
                {role.name}
              </CardTitle>
              <Badge variant="outline" className="text-xs bg-background/60">
                {department}
              </Badge>
            </div>
            <CardDescription className="text-xs sm:text-sm md:text-base text-muted-foreground mb-2">
              {role.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto pt-0 p-3 sm:p-4 md:p-6">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                {totalQuestions} questions total
              </span>
              <span className="text-xs sm:text-sm font-medium text-primary">
                Apply Now →
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }
);
RoleCard.displayName = 'RoleCard';

// Department section component - memoized to prevent re-renders
const DepartmentSection = memo(
  ({
    department,
    roles,
    generalQuestionCount,
  }: {
    department: string;
    roles: Role[];
    generalQuestionCount: number;
  }) => (
    <div className="rounded-lg p-4 sm:p-6 md:p-8 shadow-md border border-border/50 bg-card relative">
      {/* Department header with role count */}
      <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8 flex-wrap sm:flex-nowrap gap-2">
        <div className="flex items-center gap-2 sm:gap-4 w-full">
          <h2 className="text-xl sm:text-2xl font-semibold">{department}</h2>
          <div className="h-px bg-border grow hidden sm:block"></div>
        </div>
        <Badge
          variant="outline"
          className="px-2 sm:px-3 py-1 text-xs sm:text-sm whitespace-nowrap"
        >
          {roles.length} {roles.length === 1 ? 'Role' : 'Roles'}
        </Badge>
      </div>
      <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {roles.map((role) => (
          <RoleCard
            key={role.slug}
            role={role}
            department={department}
            generalQuestionCount={generalQuestionCount}
          />
        ))}
      </div>
    </div>
  )
);
DepartmentSection.displayName = 'DepartmentSection';

// Empty results component - memoized since it has no props
const EmptyResults = memo(() => (
  <div className="text-center py-8 sm:py-10 md:py-12">
    <h3 className="text-base sm:text-lg font-medium">No roles found</h3>
    <p className="text-muted-foreground mt-2 text-sm sm:text-base">
      Try adjusting your search query
    </p>
  </div>
));
EmptyResults.displayName = 'EmptyResults';

// Main page component
export default function GetInvolvedPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Memoize role data since it doesn't change
  const rolesByDepartment = useMemo(() => getRolesByDepartment(roles), []);
  const totalRoleCount = useMemo(
    () => Object.values(rolesByDepartment).flat().length,
    [rolesByDepartment]
  );

  // Memoize the count of general questions since it's static
  const generalQuestionCount = useMemo(
    () => filterOutConditionalQuestions(generalQuestions).length,
    []
  );

  // Memoize the filtered departments based on search query
  const filteredDepartments = useMemo(
    () =>
      Object.entries(rolesByDepartment)
        .map(([department, departmentRoles]) => ({
          department,
          roles: departmentRoles.filter(
            (role) =>
              role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              role.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
              department.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((dept) => dept.roles.length > 0),
    [rolesByDepartment, searchQuery]
  );

  // Memoize the handler for search input changes
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  return (
    <div className="container mx-auto pt-10 sm:pt-12 md:pt-16 lg:pt-20 pb-16 sm:pb-20 md:pb-24 lg:pb-32 px-3 sm:px-4 md:px-6 lg:px-8">
      <Hero roleCount={totalRoleCount} />

      <SearchInput value={searchQuery} onChange={handleSearchChange} />

      <div className="space-y-6 sm:space-y-8 md:space-y-12">
        {filteredDepartments.map(({ department, roles }) => (
          <DepartmentSection
            key={department}
            department={department}
            roles={roles}
            generalQuestionCount={generalQuestionCount}
          />
        ))}

        {filteredDepartments.length === 0 && <EmptyResults />}
      </div>
    </div>
  );
}
