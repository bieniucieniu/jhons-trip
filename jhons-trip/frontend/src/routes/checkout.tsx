import { useBook } from "@/api/mutations/book";
import { useBasket } from "@/components/basket";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect } from "react";
import { Link } from "wouter";

export default function Checkout() {
  const { book, deleteBook, reset } = useBasket();
  const mutaution = useBook();

  useEffect(() => {
    if (mutaution.isSuccess) reset();
  }, [mutaution.isSuccess]);

  return (
    <main className="grid grid-cols-[2fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Basket</CardTitle>
        </CardHeader>
        <CardContent>
          {book.length ? (
            <ul>
              {book.map((p) => (
                <li key="">
                  <h3>{p.journeyName}</h3>
                  <p>{p.journeyId}</p>
                  <p>for: {p.for}</p>
                  <div>
                    <Button>
                      <Link target="_blank" href={`/journey/${p.journeyId}`}>
                        more about journy
                      </Link>
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        deleteBook(p.journeyId);
                      }}
                    >
                      delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>no item in basket</p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>checkout</CardTitle>
          <CardContent>
            <Button
              onClick={() => {
                if (book.length > 0) mutaution.mutate(book);
              }}
            >
              submmit
            </Button>
            {mutaution.isSuccess ? "done" : null}
          </CardContent>
        </CardHeader>
      </Card>
    </main>
  );
}
