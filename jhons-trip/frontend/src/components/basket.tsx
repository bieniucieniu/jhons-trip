import { Book } from "@/api/mutations/book";
import { createContext, useContext, useState } from "react";

const basketContext = createContext<
  | { book: Book[]; addBook: (b: Book) => void; deleteBook: (b: Book) => void }
  | undefined
>(undefined);

export function BasketProvider({ children }: { children: React.ReactNode }) {
  const [book, setBook] = useState<Book[]>([]);

  function addBook(newBook: Book, callback?: (message: string) => void) {
    const i = book.findIndex((b) => b.journeyId === newBook.journeyId);
    if (i !== -1) {
      book[i] = newBook;
      setBook([...book]);
      callback && callback("item has been updated");
      return;
    }

    setBook([...book, newBook]);

    callback && callback("item added");
  }

  function deleteBook(toDelete: Book, callback?: (message: string) => void) {
    const out = book.filter((b) => {
      return b.journeyId !== toDelete.journeyId;
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
