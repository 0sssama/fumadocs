import { PlusIcon } from 'lucide-react';
import Image, { type StaticImageData } from 'next/image';
import { buttonVariants } from '@/components/ui/button';
import NextFAQImage from '@/public/showcases/next-faq.png';
import YeecordImage from '@/public/showcases/yeecord.png';
import { cn } from '@/utils/cn';
import { createMetadata } from '@/utils/metadata';
import NuqsImage from '@/public/showcases/nuqs.jpg';
import FrameGround from '@/public/showcases/frameground.png';
import Spot from '@/public/spot.png';

export const metadata = createMetadata({
  title: 'Showcase',
  description: 'Some cool websites using Fumadocs',
  openGraph: {
    url: 'https://fumadocs.vercel.app/showcase',
  },
});

interface ShowcaseObject {
  image?: StaticImageData;
  name: string;
  url: string;
}

export default function Showcase(): React.ReactElement {
  const showcases: ShowcaseObject[] = [
    {
      image: NextFAQImage,
      name: 'Next.js Discord Common Questions',
      url: 'https://nextjs-faq.com',
    },
    {
      image: YeecordImage,
      name: 'Yeecord Docs',
      url: 'https://yeecord.com',
    },
    { image: NuqsImage, name: 'nuqs', url: 'https://nuqs.47ng.com' },
    {
      name: 'Typelytics',
      url: 'https://typelytics.rhyssul.com',
    },
    {
      image: FrameGround,
      name: 'FrameGround',
      url: 'https://docs.frameground.tech',
    },
    {
      name: "RUNFUNRUN's Blog",
      url: 'https://www.runfunrun.tech',
    },
  ];

  return (
    <main className="pb-16">
      <Image
        alt="spot"
        src={Spot}
        priority
        sizes="100vw"
        className="absolute top-0 z-[-1] min-h-[800px] w-full max-w-[1600px] select-none object-cover opacity-50"
      />
      <div className="container my-12 text-center">
        <h1 className="mb-4 text-3xl font-semibold leading-snug md:text-5xl md:leading-snug">
          Cool Websites
          <br />
          Made with Fumadocs
        </h1>
        <p className="text-muted-foreground">
          Nice open-source projects powered by Fumadocs
        </p>
        <div className="mt-6">
          <a
            href="https://github.com/fuma-nama/fumadocs/discussions/30"
            target="_blank"
            rel="noreferrer noopener"
            className={cn(buttonVariants())}
          >
            <PlusIcon className="mr-2 size-4" />
            Add Your Own
          </a>
        </div>
      </div>

      <div className="container mt-12 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {showcases.map((showcase) => (
          <ShowcaseItem key={showcase.url} {...showcase} />
        ))}
      </div>
    </main>
  );
}

function ShowcaseItem({
  name,
  url,
  image,
}: ShowcaseObject): React.ReactElement {
  if (image) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer noopener"
        className="relative flex aspect-video flex-col overflow-hidden rounded-2xl border transition-all hover:border-primary/30"
      >
        <Image
          alt="Preview"
          src={image}
          placeholder="blur"
          className="absolute size-full object-cover"
        />
        <p className="z-[2] mt-auto bg-gradient-to-t from-black p-6 pt-8 text-sm font-medium text-white">
          {name}
        </p>
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      className="flex aspect-video flex-col rounded-2xl border border-transparent p-8 text-center shadow-primary/20 transition-all hover:shadow-primary/30"
      style={{
        backgroundImage:
          'radial-gradient(closest-side at center, hsl(var(--background)) 89%, transparent 90%),' +
          'conic-gradient(from 0deg, hsl(var(--background)) 120deg, hsl(var(--primary)), hsl(var(--background)) 240deg),' +
          'linear-gradient(to right bottom, black, rgb(200,200,200), black)',
        backgroundOrigin: 'border-box',
        boxShadow: 'inset 0px 12px 28px 4px var(--tw-shadow-color)',
        backgroundClip: 'padding-box, padding-box, border-box',
      }}
    >
      <p className="mb-6 text-muted-foreground">{new URL(url).hostname}</p>
      <p className="text-3xl font-semibold">{name}</p>
    </a>
  );
}
