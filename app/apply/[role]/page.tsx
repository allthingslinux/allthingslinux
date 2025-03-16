'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { roles } from '@/data/forms/roles';
import { generalQuestions } from '@/data/forms/questions/general';
import FormWrapper from '@/components/forms/FormWrapper';
import { generateFormSchema } from '@/lib/utils';
import { z } from 'zod';

export default function RoleApplicationPage() {
  const router = useRouter();
  const params = useParams();
  const roleSlug = params.role as string;

  const role = roles.find((r) => r.slug === roleSlug);
  if (!role) {
    notFound();
  }

  const questions = [
    // general questions
    ...generalQuestions,
    // departmental and role questions
    ...role.questions,
  ];

  const formSchema = generateFormSchema(questions);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: Object.fromEntries(
      questions.map((q) => [q.name, q.type === 'select' ? '' : ''])
    ),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
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
    <FormWrapper
      form={form}
      questions={questions}
      title={`${role.name} Application`}
      description={`Apply for our ${role.department} team`}
      onSubmit={form.handleSubmit(onSubmit)}
    />
  );
}
