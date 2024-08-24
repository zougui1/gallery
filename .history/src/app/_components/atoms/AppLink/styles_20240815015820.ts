import { tv, type VariantProps } from 'tailwind-variants';

export const linkStyles = tv({
  base: '',

  variants: {
    variant: {
      link: 'text-blue-100 hover:text-foreground',
      button: '',
    },

    disabled: {
      true: '!bg-muted',
    },
  },

  defaultVariants: {
    variant: 'link',
  },

  compoundVariants: [
    {
      variant: 'button',
      disabled: true,
      className: 'cursor-default !bg-muted',
    },
  ],
});

export interface LinkVariants extends VariantProps<typeof linkStyles> {

}
