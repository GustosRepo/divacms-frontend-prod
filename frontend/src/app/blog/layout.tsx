import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Diva Factory Blog | Y2K Nail Trends, Kawaii Culture & Beauty Tips",
  description: "Discover the latest Y2K nail trends, kawaii fashion tips, press-on nail care guides, and beauty inspiration. Your go-to source for cute culture content.",
  keywords: "Y2K nail trends, kawaii fashion, press-on nail care, nail art blog, kawaii culture, beauty blog, nail tips",
  openGraph: {
    title: "Diva Factory Blog | Y2K Nail Trends & Kawaii Culture",
    description: "Your go-to source for Y2K nail trends, kawaii fashion tips, and beauty inspiration.",
  },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
