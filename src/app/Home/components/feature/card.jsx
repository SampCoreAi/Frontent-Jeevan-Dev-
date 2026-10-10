import * as React from "react";

import { cn } from "../../components/feature/utils";

/* =========================================
   CARD
========================================= */

const Card = React.forwardRef(function Card(
  { className, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        `
        relative
        overflow-hidden

        rounded-[20px]

        border
        border-[#DDE9E4]

        bg-white

        text-[#172033]

        shadow-[0_18px_55px_rgba(6,62,42,0.12)]

        transition-all
        duration-300
        ease-out
        `,
        className
      )}
      {...props}
    />
  );
});

Card.displayName = "Card";

/* =========================================
   CARD HEADER
========================================= */

const CardHeader = React.forwardRef(function CardHeader(
  { className, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        `
        relative
        flex
        flex-col

        px-5
        pt-5
        pb-4

        border-b
        border-[#EDF3F0]

        bg-gradient-to-r
        from-[#F4FAF7]
        via-white
        to-white
        `,
        className
      )}
      {...props}
    />
  );
});

CardHeader.displayName = "CardHeader";

/* =========================================
   CARD TITLE
========================================= */

const CardTitle = React.forwardRef(function CardTitle(
  { className, ...props },
  ref
) {
  return (
    <h3
      ref={ref}
      className={cn(
        `
        text-[17px]
        md:text-[18px]

        font-bold

        leading-tight

        tracking-[-0.02em]

        text-[#063E2A]
        `,
        className
      )}
      {...props}
    />
  );
});

CardTitle.displayName = "CardTitle";

/* =========================================
   CARD DESCRIPTION
========================================= */

const CardDescription = React.forwardRef(function CardDescription(
  { className, ...props },
  ref
) {
  return (
    <p
      ref={ref}
      className={cn(
        `
        mt-2

        text-[13px]

        leading-[1.7]

        text-[#66736E]
        `,
        className
      )}
      {...props}
    />
  );
});

CardDescription.displayName = "CardDescription";

/* =========================================
   CARD CONTENT
========================================= */

const CardContent = React.forwardRef(function CardContent(
  { className, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        `
        px-5
        py-5

        text-[13px]

        leading-[1.7]

        text-[#66736E]
        `,
        className
      )}
      {...props}
    />
  );
});

CardContent.displayName = "CardContent";

/* =========================================
   CARD FOOTER
========================================= */

const CardFooter = React.forwardRef(function CardFooter(
  { className, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        `
        flex
        items-center
        gap-2

        px-5
        py-4

        border-t
        border-[#EDF3F0]

        bg-[#FAFCFB]
        `,
        className
      )}
      {...props}
    />
  );
});

CardFooter.displayName = "CardFooter";

/* =========================================
   EXPORT
========================================= */

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};