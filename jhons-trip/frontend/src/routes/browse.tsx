import JourneysFilterList from "@/components/journeysFilterList";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Redirect, useParams } from "wouter";
export default function Browse() {
  const { page } = useParams();
  if (!page) return <Redirect to="/browse/1" />;
  const p = Number(page);
  if (p < 1) return <Redirect to="/browse/1" />;
  return (
    <div className="m-auto max-w-screen-2xl py-10">
      <Pagination className="py-3">
        <PaginationContent>
          {p > 1 ? (
            <>
              <PaginationItem>
                <PaginationPrevious href={"/browse/" + (p - 1)} />
              </PaginationItem>
              {p > 2 ? (
                <>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                </>
              ) : null}
              <PaginationItem>
                <PaginationLink href={"/browse/" + (p - 1)}>
                  {p - 1}
                </PaginationLink>
              </PaginationItem>
            </>
          ) : null}

          <PaginationItem>
            <PaginationLink href="#" isActive>
              {p}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href={"/browse/" + (p + 1)}>{p + 1}</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href={"/browse/" + (p + 1)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <JourneysFilterList
        filters={{
          limit: 20,
          offset: (p - 1) * 20,
        }}
      />
      <Pagination>
        <PaginationContent>
          {p > 1 ? (
            <>
              <PaginationItem>
                <PaginationPrevious href={"/browse/" + (p - 1)} />
              </PaginationItem>
              {p > 2 ? (
                <>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                </>
              ) : null}
              <PaginationItem>
                <PaginationLink href={"/browse/" + (p - 1)}>
                  {p - 1}
                </PaginationLink>
              </PaginationItem>
            </>
          ) : null}

          <PaginationItem>
            <PaginationLink href="#" isActive>
              {p}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href={"/browse/" + (p + 1)}>{p + 1}</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href={"/browse/" + (p + 1)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
