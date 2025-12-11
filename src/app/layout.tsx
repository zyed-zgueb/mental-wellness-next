import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

// Since we have a `[locale]` segment in `app/[locale]/layout.tsx`,
// this root layout is only used for non-locale routes like API routes
export default function RootLayout({ children }: Props) {
  return children;
}
