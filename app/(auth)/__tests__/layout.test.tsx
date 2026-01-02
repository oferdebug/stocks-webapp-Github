import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import React from 'react';

// Mock Next.js components
vi.mock('next/link', () => ({
  default: ({ children, href }: any) => <a href={href}>{children}</a>
}));

vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />
}));

// Mock TestimonialRotator component
vi.mock('../../../components/testimonials/TestimonialRotator', () => ({
  TestimonialRotator: ({ intervalMs }: { intervalMs: number }) => (
    <div data-testid="testimonial-rotator" data-interval={intervalMs}>
      Testimonial Rotator
    </div>
  )
}));

describe('app/(auth)/layout.tsx', () => {
  let Layout: any;

  beforeEach(async () => {
    vi.resetModules();
    const module = await import('../layout');
    Layout = module.default;
  });

  describe('Component rendering', () => {
    it('should render the main layout structure', () => {
      const children = <div>Auth Form Content</div>;
      const { container } = render(<Layout>{children}</Layout>);
      expect(container.querySelector('main.auth-layout')).toBeInTheDocument();
    });

    it('should render both left and right sections', () => {
      const children = <div>Content</div>;
      render(<Layout>{children}</Layout>);
      
      const leftSection = document.querySelector('.auth-left-section');
      const rightSection = document.querySelector('.auth-right-section');
      
      expect(leftSection).toBeInTheDocument();
      expect(rightSection).toBeInTheDocument();
    });

    it('should render children in the left section', () => {
      const testContent = 'Test Auth Form';
      const children = <div data-testid="child-content">{testContent}</div>;
      render(<Layout>{children}</Layout>);
      
      const childElement = screen.getByTestId('child-content');
      expect(childElement).toBeInTheDocument();
      expect(childElement).toHaveTextContent(testContent);
    });

    it('should render the logo link', () => {
      const children = <div>Content</div>;
      render(<Layout>{children}</Layout>);
      
      const logoLink = screen.getByRole('link');
      expect(logoLink).toHaveAttribute('href', '/');
      expect(logoLink).toHaveClass('auth-logo');
    });

    it('should render the logo image with correct attributes', () => {
      const children = <div>Content</div>;
      render(<Layout>{children}</Layout>);
      
      const logoImage = screen.getByAltText('NextTrade Logo');
      expect(logoImage).toBeInTheDocument();
      expect(logoImage).toHaveAttribute('src', '/assets/icons/logo1-nexttrade-dark (1).svg');
      expect(logoImage).toHaveAttribute('width', '140');
      expect(logoImage).toHaveAttribute('height', '32');
    });

    it('should render TestimonialRotator component', () => {
      const children = <div>Content</div>;
      render(<Layout>{children}</Layout>);
      
      const testimonialRotator = screen.getByTestId('testimonial-rotator');
      expect(testimonialRotator).toBeInTheDocument();
      expect(testimonialRotator).toHaveAttribute('data-interval', '7000');
    });

    it('should render dashboard preview image', () => {
      const children = <div>Content</div>;
      render(<Layout>{children}</Layout>);
      
      const dashboardImage = screen.getByAltText('NextTrade Dashboard Preview');
      expect(dashboardImage).toBeInTheDocument();
      expect(dashboardImage).toHaveAttribute('src', '/assets/images/485_1x_shots_so.png');
      expect(dashboardImage).toHaveAttribute('width', '1200');
      expect(dashboardImage).toHaveAttribute('height', '800');
    });
  });

  describe('CSS classes - scroll-pt-12 addition', () => {
    it('should apply scroll-pt-12 class to left section (NEW CHANGE)', () => {
      const children = <div>Content</div>;
      render(<Layout>{children}</Layout>);
      
      const leftSection = document.querySelector('.auth-left-section');
      expect(leftSection).toHaveClass('scroll-pt-12');
    });

    it('should apply all required CSS classes to left section', () => {
      const children = <div>Content</div>;
      render(<Layout>{children}</Layout>);
      
      const leftSection = document.querySelector('.auth-left-section');
      expect(leftSection).toHaveClass('auth-left-section');
      expect(leftSection).toHaveClass('scrollbar-hide-default');
      expect(leftSection).toHaveClass('scroll-pt-12');
    });

    it('should have exactly three classes on left section', () => {
      const children = <div>Content</div>;
      render(<Layout>{children}</Layout>);
      
      const leftSection = document.querySelector('.auth-left-section');
      const classes = leftSection?.className.split(' ').filter(c => c.length > 0) || [];
      
      expect(classes).toContain('auth-left-section');
      expect(classes).toContain('scrollbar-hide-default');
      expect(classes).toContain('scroll-pt-12');
      expect(classes.length).toBe(3);
    });

    it('should apply correct classes to right section', () => {
      const children = <div>Content</div>;
      render(<Layout>{children}</Layout>);
      
      const rightSection = document.querySelector('.auth-right-section');
      expect(rightSection).toHaveClass('auth-right-section');
      expect(rightSection).toHaveClass('flex');
      expect(rightSection).toHaveClass('flex-col');
      expect(rightSection).toHaveClass('justify-center');
    });
  });

  describe('Layout structure', () => {
    it('should have proper grid layout for testimonial section', () => {
      const children = <div>Content</div>;
      const { container } = render(<Layout>{children}</Layout>);
      
      const gridContainer = container.querySelector('.grid');
      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer).toHaveClass('items-end');
      expect(gridContainer).toHaveClass('w-full');
    });

    it('should have relative positioning for dashboard preview', () => {
      const children = <div>Content</div>;
      const { container } = render(<Layout>{children}</Layout>);
      
      const previewWrapper = container.querySelector('.relative.mt-10');
      expect(previewWrapper).toBeInTheDocument();
      expect(previewWrapper).toHaveClass('flex');
      expect(previewWrapper).toHaveClass('justify-center');
    });

    it('should have background blur effect element', () => {
      const children = <div>Content</div>;
      const { container } = render(<Layout>{children}</Layout>);
      
      const blurElements = container.querySelectorAll('.absolute');
      expect(blurElements.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    it('should have descriptive alt text for images', () => {
      const children = <div>Content</div>;
      render(<Layout>{children}</Layout>);
      
      expect(screen.getByAltText('NextTrade Logo')).toBeInTheDocument();
      expect(screen.getByAltText('NextTrade Dashboard Preview')).toBeInTheDocument();
    });

    it('should have semantic HTML structure', () => {
      const children = <div>Content</div>;
      const { container } = render(<Layout>{children}</Layout>);
      
      expect(container.querySelector('main')).toBeInTheDocument();
      expect(container.querySelectorAll('section')).toHaveLength(2);
    });

    it('should render clickable logo for navigation', () => {
      const children = <div>Content</div>;
      render(<Layout>{children}</Layout>);
      
      const logoLink = screen.getByRole('link');
      expect(logoLink).toHaveAttribute('href', '/');
    });
  });

  describe('Responsive behavior', () => {
    it('should have responsive padding classes', () => {
      const children = <div>Content</div>;
      const { container } = render(<Layout>{children}</Layout>);
      
      const childrenWrapper = container.querySelector('.pb-7');
      expect(childrenWrapper).toHaveClass('flex-1');
    });

    it('should have responsive padding for right section', () => {
      const children = <div>Content</div>;
      const { container } = render(<Layout>{children}</Layout>);
      
      const rightSection = container.querySelector('.auth-right-section');
      expect(rightSection).toHaveClass('px-10');
    });
  });

  describe('Image properties', () => {
    it('should have proper dimensions for logo', () => {
      const children = <div>Content</div>;
      render(<Layout>{children}</Layout>);
      
      const logoImage = screen.getByAltText('NextTrade Logo');
      expect(logoImage).toHaveClass('h-8');
      expect(logoImage).toHaveClass('w-auto');
    });

    it('should have transform and animation classes on dashboard image', () => {
      const children = <div>Content</div>;
      render(<Layout>{children}</Layout>);
      
      const dashboardImage = screen.getByAltText('NextTrade Dashboard Preview');
      expect(dashboardImage).toHaveClass('transition-all');
      expect(dashboardImage).toHaveClass('duration-700');
    });
  });

  describe('Integration with child components', () => {
    it('should pass intervalMs prop to TestimonialRotator', () => {
      const children = <div>Content</div>;
      render(<Layout>{children}</Layout>);
      
      const rotator = screen.getByTestId('testimonial-rotator');
      expect(rotator).toHaveAttribute('data-interval', '7000');
    });

    it('should render multiple children correctly', () => {
      const children = (
        <>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
        </>
      );
      render(<Layout>{children}</Layout>);
      
      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
    });
  });
});