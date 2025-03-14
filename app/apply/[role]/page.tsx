'use client';

import { useParams, notFound } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { roles } from '@/data/forms/roles';
import { generalQuestions } from '@/data/forms/questions/general';
import FormWrapper from '@/components/forms/FormWrapper';
import { generateFormSchema } from '@/lib/utils';

export default function RoleApplicationPage() {
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
    defaultValues: {},
  });

  const onSubmit = async (data: any) => {
    await fetch(`/api/forms/${role.slug}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // handle submission confirmation logic here
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
