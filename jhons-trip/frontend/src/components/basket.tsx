import { Book, bookSchema } from "@/api/mutations/book";
import { createContext, useContext, useState } from "react";

const basketContext = createContext<
  | {
      book: Book[];
      addBook: (b: Partial<Book>, callback?: (m: string) => void) => void;
      deleteBook: (id: number, callback?: (m: string) => void) => void;
    }
  | undefined
>(undefined);

export function BasketProvider({ children }: { children: React.ReactNode }) {
  const [book, setBook] = useState<Book[]>([]);

  function addBook(
    newBook: Partial<Book>,
    callback?: (message: string) => void,
  ) {
    const s = bookSchema.safeParse(newBook);
    if (!s.success) {
      callback && callback(s.error.message);
      return;
    }

    const i = book.findIndex((b) => b.journeyId === s.data.journeyId);
    if (i !== -1) {
      book[i] = s.data;
      setBook([...book]);
      callback && callback("item has been updated");
      return;
    }

    setBook([...book, s.data]);

    callback && callback("item added");
  }

  function deleteBook(id: number, callback?: (message: string) => void) {
    const out = book.filter((b) => {
      return b.journeyId !== id;
    });

    const message =
      book.length === out.length ? "no item in basket" : "deleted from basket";
    setBook([...out]);
    callback && callback(message);
  }

  return (
    <basketContext.Provider value={{ book, addBook, deleteBook }}>
      {children}
    </basketContext.Provider>
  );
}

export function useBasket() {
  const c = useContext(basketContext);
  if (!c) throw new Error("not in basket context");

  return c;
}

export function Basket() {
  const {} = useBasket();
}
