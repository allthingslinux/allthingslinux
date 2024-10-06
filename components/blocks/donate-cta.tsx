import { Button } from '@/components/ui/button';

import { BsOpencollective } from 'react-icons/bs';

const DonateCta = () => {
  return (
    <section className='py-32'>
      <div
        className='container relative overflow-hidden rounded-lg bg-cover bg-center'
        style={{
          backgroundImage: 'url("https://i.imgur.com/wjG5n5m.png")',
        }}>
        <div className='absolute inset-0 bg-black opacity-40'></div>
        <div className='relative flex w-full flex-col gap-16 p-8 md:rounded-xl lg:flex-row lg:items-center lg:p-16'>
          <div className='flex-1'>
            <BsOpencollective className='size-12 mb-8' />
            <h3 className='mb-3 text-2xl font-semibold text-white md:mb-4 md:text-4xl lg:mb-6'>
              Support our Community
            </h3>
            <p className='text-white text-balance lg:text-lg'>
              All Things Linux is a community-driven project that relies on
              donations and out of pocket funds. Your donations help us keep the
              lights on and provide more services to the community.
            </p>
            <div className='mt-4'>
              <Button variant='outline'>
                <a
                  href='https://opencollective.com/allthingslinux'
                  target='_blank'
                  rel='noopener noreferrer'>
                  Visit our Open Collective
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DonateCta;
