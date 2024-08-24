import { tv, type VariantProps } from 'tailwind-variants';

export const linkStyles = tv({
  base: '',

  variants: {
    variant: {
      link: 'text-blue-100 hover:text-foreground',
      button: '',
    },
  },

  defaultVariants: {
    variant: 'link',
  },
});

export interface LinkVariants extends VariantProps<typeof linkStyles> {

}
