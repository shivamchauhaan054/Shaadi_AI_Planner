import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Heading, Text } from "@/components/layout/typography";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="page-shell flex min-h-[50vh] items-center">
      <Container size="narrow" className="text-center">
        <div className="glass-card mx-auto max-w-md p-10">
          <Heading as="h1" className="mb-3 text-3xl">
            Page not found
          </Heading>
          <Text className="mb-8">
            The page you are looking for does not exist or may have moved.
          </Text>
          <Button asChild className="shadow-soft">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </Container>
    </div>
  );
}
