'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import { roles } from '@/data/forms/roles';
import { generalQuestions } from '@/data/forms/questions/general';
import { z } from 'zod';
import StepperForm from '@/components/multi-step-form/StepperForm';
import { generateFormSchema } from '@/lib/utils';
import Link from 'next/link';
import { ChevronLeftIcon } from '@radix-ui/react-icons';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function RoleApplicationPage() {
  const router = useRouter();
  const params = useParams();

  const roleSlug = params.role as string;

  const role = roles.find((r) => r.slug === roleSlug);

  if (!role) {
    notFound();
  }

  // Use the explicit organization from roles.ts instead of filtering
  // Each role in roles.ts already combines departmental and role-specific questions

  // All questions for validation and submission
  const allQuestions = [...generalQuestions, ...role.questions];

  // Create our schema
  const _formSchema = generateFormSchema(allQuestions);

  const onSubmit = async (data: z.infer<typeof _formSchema>) => {
    try {
      // Create FormData instance
      const formData = new FormData();

      // Add all form fields to FormData
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, JSON.stringify(value));
        }
      });

      const response = await fetch(`/api/forms/${role.slug}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        router.push('/apply/success');
      } else {
        console.error('Form submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="mx-auto py-22">
      {/* Center all content */}
      <div className="grid grid-cols-1 gap-6 justify-items-center">
        {/* Centered header with consistent width */}
        <div className="w-full max-w-[800px]">
          {/* Back button */}
          <div className="mb-6">
            <Link href="/get-involved" passHref>
              <Button
                variant="ghost"
                size="sm"
                className="group text-muted-foreground hover:text-foreground"
              >
                <ChevronLeftIcon className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                Back to Roles
              </Button>
            </Link>
          </div>

          <div className="flex flex-col items-center mb-4 text-center">
            <Badge className="text-xs py-1 px-3 mb-4" variant="outline">
              {role.department}
            </Badge>
            <h1 className="text-3xl font-bold">Apply for {role.name}</h1>
          </div>

          {/* Description card with same width as header */}
          <Card className="w-full bg-muted/30 border-muted">
            <CardContent className="pt-6">
              <div className="flex gap-2 items-start">
                <div className="w-1 h-full bg-primary rounded-full self-stretch"></div>
                <p className="text-muted-foreground">{role.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Form with same max-width */}
        <div className="w-full max-w-[800px]">
          <StepperForm
            generalQuestions={generalQuestions}
            departmentalQuestions={role.questions}
            roleQuestions={[]}
            role={role}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </div>
  );
}
