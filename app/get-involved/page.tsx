'use client';

import { useState } from 'react';
import Link from 'next/link';
import { roles } from '@/data/forms/roles';
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

export default function GetInvolvedPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const rolesByDepartment = getRolesByDepartment(roles);

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
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Get Involved</h1>
        <p className="text-lg text-muted-foreground">
          Join our community and make a difference. Find the perfect role that
          matches your skills and interests.
        </p>
      </div>

      <div className="max-w-md mx-auto mb-8">
        <Input
          type="search"
          placeholder="Search roles by title, department, or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      <div className="space-y-12">
        {filteredDepartments.map(({ department, roles }) => (
          <div key={department}>
            <h2 className="text-2xl font-semibold mb-6">{department}</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {roles.map((role) => (
                <Link
                  key={role.slug}
                  href={`/apply/${role.slug}`}
                  className="block transition-transform hover:scale-105"
                >
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-xl">{role.name}</CardTitle>
                        <Badge variant="secondary">{department}</Badge>
                      </div>
                      <CardDescription>{role.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          {role.questions.length} questions
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
        ))}

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
