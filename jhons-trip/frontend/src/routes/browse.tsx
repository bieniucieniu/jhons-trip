import getLimit from "@/api/queries/limit";
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
import { Redirect, useLocation, useParams } from "wouter";
export default function Browse() {
  const [_, setLocation] = useLocation();
  const { page } = useParams();
  const { data: limit, status } = getLimit("joutney");
  const maxPage: number =
    status === "success" && limit ? Math.ceil(limit.valueOf() / 20) : Infinity;

  if (!page) return <Redirect to="/browse/1" />;
  const p = Number(page);
  if (p < 1) return <Redirect to="/browse/1" />;
  return (
    <div className="m-auto max-w-screen-2xl py-10">
      <Pagination className="py-3">
        <PaginationContent>
          {p > 1 ? (
            <>
              {p > 2 ? (
                <>
                  <PaginationItem>
                    <PaginationPrevious href={"/browse/" + (p - 1)} />
                  </PaginationItem>
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
          {maxPage > p ? (
            <>
              <PaginationItem>
                <PaginationLink
                  onClick={() => {
                    setLocation(
                      "/browse/" + (p + 1) + document.location.search,
                    );
                  }}
                >
                  {p + 1}
                </PaginationLink>
              </PaginationItem>
              {maxPage > p + 1 ? (
                <>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => {
                        setLocation(
                          "/browse/" + (p + 1) + document.location.search,
                        );
                      }}
                    />
                  </PaginationItem>
                </>
              ) : null}
            </>
          ) : null}
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
              {p > 2 ? (
                <>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => {
                        setLocation(
                          "/browse/" + (p - 1) + document.location.search,
                        );
                      }}
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                </>
              ) : null}
              <PaginationItem>
                <PaginationLink
                  onClick={() => {
                    setLocation(
                      "/browse/" + (p - 1) + document.location.search,
                    );
                  }}
                >
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
          {maxPage > p ? (
            <>
              <PaginationItem>
                <PaginationLink
                  onClick={() => {
                    setLocation(
                      "/browse/" + (p + 1) + document.location.search,
                    );
                  }}
                >
                  {p + 1}
                </PaginationLink>
              </PaginationItem>
              {maxPage > p + 1 ? (
                <>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => {
                        setLocation(
                          "/browse/" + (p + 1) + document.location.search,
                        );
                      }}
                    />
                  </PaginationItem>
                </>
              ) : null}
            </>
          ) : null}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
