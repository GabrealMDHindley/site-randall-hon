// Testimonials — empty until real client quotes are supplied (with permission to
// publish). The home page's testimonials section renders only when this array is
// non-empty — never a placeholder header over nothing. See status.md needs-user list.

export interface Testimonial {
  name: string;
  quote: string;
  context?: string;
}

export const testimonials: Testimonial[] = [];
