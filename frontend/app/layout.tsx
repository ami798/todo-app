import "./globals.css";
export const metadata = { title: "My Tasks", description: "A simple task manager" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body>{children}</body></html>);
}
