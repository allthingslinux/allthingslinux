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
    <div className="container mx-auto pt-24 sm:pt-28 md:pt-32 lg:pt-36 pb-16 sm:pb-20 md:pb-24 lg:pb-32 px-3 sm:px-4 md:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center mb-6 sm:mb-8 md:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 sm:mb-4">
          Get Involved
        </h1>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground">
          Join our community and make a difference. Find the perfect role that
          matches your skills and interests.
        </p>
      </div>

      <div className="max-w-md mx-auto mb-8 sm:mb-10 md:mb-14">
        <Input
          type="search"
          placeholder="Search roles by title, department, or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full text-center text-sm sm:text-base"
        />
      </div>

      <div className="space-y-6 sm:space-y-8 md:space-y-12">
        {filteredDepartments.map(({ department, roles }) => {
          return (
            <div
              key={department}
              className="rounded-lg p-4 sm:p-6 md:p-8 shadow-md border border-border/50 bg-card relative"
            >
              {/* Enhanced department header with role count */}
              <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8 flex-wrap sm:flex-nowrap gap-2">
                <div className="flex items-center gap-2 sm:gap-4 w-full">
                  <h2 className="text-xl sm:text-2xl font-semibold">
                    {department}
                  </h2>
                  <div className="h-[1px] bg-border flex-grow hidden sm:block"></div>
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
                  <Link
                    key={role.slug}
                    href={`/apply/${role.slug}`}
                    className="block h-full"
                  >
                    <Card className="hover:ring-2 hover:ring-primary/20 transition-all duration-300 rounded-md h-full flex flex-col border-border/50 bg-background/60 backdrop-blur-sm">
                      <CardHeader className="p-3 sm:p-4 md:p-6">
                        <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
                          <CardTitle className="text-base sm:text-lg">
                            {role.name}
                          </CardTitle>
                          <Badge
                            variant="outline"
                            className="text-xs bg-background/60"
                          >
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
                            {generalQuestionCount +
                              filterOutConditionalQuestions(role.questions)
                                .length}{' '}
                            questions total
                          </span>
                          <span className="text-xs sm:text-sm font-medium text-primary">
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
          <div className="text-center py-8 sm:py-10 md:py-12">
            <h3 className="text-base sm:text-lg font-medium">No roles found</h3>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Try adjusting your search query
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
