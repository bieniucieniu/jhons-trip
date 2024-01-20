import Banner from "@/components/Banner";
import JourneysList from "@/components/journeysList";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function Root() {
  return (
    <main className="flex justify-between m-auto max-w-screen-lg py-10">
      <Banner></Banner>
      <div className="flex flex-col justify-center">
        <JourneysList
          query={{ limit: 10 }}
          className="flex flex-col gap-y-10"
        />
        <Button variant="link" className="text-xl group hover:no-underline">
          <span className="opacity-0 group-hover:opacity-100 group-hover:-translate-x-2 transition-all">
            &lt;
          </span>
          <Link href="/browse/1" className="group-hover:underline">
            browse all
          </Link>
          <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
            &gt;
          </span>
        </Button>
      </div>
    </main>
  );
}
