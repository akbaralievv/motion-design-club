'use client';
import Image from 'next/image';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/lib/constants';
import { useState } from 'react';

export default function AboutPage() {
  const [showVimeo, setShowVimeo] = useState(false);

  const handleVideoClick = () => {
    setShowVimeo(true);
  };

  return (
    <MainLayout>
      <div className="container py-12 md:py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About Motion Design Club</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're on a mission to empower creative professionals with the skills they need to
            succeed in motion design.
          </p>
        </div>

        <div className="relative mb-20 aspect-video rounded-xl overflow-hidden shadow-xl group">
          {!showVimeo ? (
            <>
              <video
                src="https://cdn.prod.website-files.com/64f764c103612a0779cf1fa2%2F667ef432525f5b34b1c80f29_video-transcode.mp4"
                poster="/images/about-video-poster.jpg"
                autoPlay
                muted
                loop
                playsInline
                className="w-full cursor-pointer h-full object-cover [&::-webkit-media-controls]:hidden [&::-webkit-media-controls-enclosure]:hidden [&::-webkit-media-controls-panel]:hidden"
              />
              <div
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                onClick={handleVideoClick}>
                <button className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-black">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <iframe
              src="https://player.vimeo.com/video/930289523?autoplay=1&background=0"
              className="absolute inset-0 w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
        {/* Our Story */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <p className="mb-4">
              Motion Design Club was founded in 2020 by a team of industry professionals who saw a
              gap in high-quality, accessible motion design education. What started as a small
              collection of tutorials has grown into a comprehensive learning platform with
              thousands of students worldwide.
            </p>
            <p>
              We believe that motion design is not just about software proficiency, but about
              developing a creative eye, understanding principles of animation, and mastering visual
              storytelling. Our courses are built with this holistic approach in mind.
            </p>
          </div>
          <div className="relative aspect-video rounded-xl overflow-hidden shadow-xl">
            <video
              src="https://assets-global.website-files.com/64f764c103612a0779cf1fa2/64f7aef217a7416582d26d58_hero-transcode.mp4"
              poster="/images/about-video-poster.jpg"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover [&::-webkit-media-controls]:hidden [&::-webkit-media-controls-enclosure]:hidden [&::-webkit-media-controls-panel]:hidden"
            />
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary">
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Excellence</h3>
              <p className="text-muted-foreground">
                We're committed to delivering the highest quality education, with courses created by
                working professionals who are masters of their craft.
              </p>
            </div>
            <div className="bg-card rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="m7 9 5 3.5L7 16v-7Z" />
                  <path d="m12 9 5 3.5-5 3.5V9Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-muted-foreground">
                We continuously update our curriculum to reflect the latest industry trends, tools,
                and techniques to keep our students at the cutting edge.
              </p>
            </div>
            <div className="bg-card rounded-xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary">
                  <path d="M17 6.1H3" />
                  <path d="M21 12.1H3" />
                  <path d="M15.1 18H3" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Accessibility</h3>
              <p className="text-muted-foreground">
                We believe quality education should be accessible to all, regardless of background
                or prior experience, with courses designed for various skill levels.
              </p>
            </div>
          </div>
        </div>

        {/* Our Team */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                name: 'Alex Johnson',
                role: 'Founder & Lead Instructor',
                specialty: 'Motion Graphics',
              },
              { name: 'Sam Rivera', role: 'Creative Director', specialty: '3D Animation' },
              { name: 'Jordan Lee', role: 'Course Director', specialty: 'Character Animation' },
              { name: 'Taylor Kim', role: 'Senior Instructor', specialty: 'Visual Effects' },
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="rounded-full bg-muted w-32 h-32 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-4xl font-light text-muted-foreground">
                    {member.name.charAt(0)}
                  </span>
                </div>
                <h3 className="font-semibold mb-1">{member.name}</h3>
                <p className="text-sm text-muted-foreground mb-1">{member.role}</p>
                <p className="text-xs text-primary">{member.specialty}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary/10 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Your Motion Design Journey</h2>
          <p className="text-lg max-w-2xl mx-auto mb-8">
            Whether you're just getting started or looking to advance your skills, we have courses
            that will help you reach your goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses">
              <Button size="lg">Explore Our Courses</Button>
            </Link>
            <Link href="/register">
              <Button variant="outline" size="lg">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
