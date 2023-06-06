import { atom, selector } from "recoil";

export interface ICountry {
  id: number;
  name: string;
  state: "WANT" | "BEEN" | "LIKE";
}

export const countriesState = atom<ICountry[]>({
  key: "country",
  default: JSON.parse(localStorage.getItem("countries") ?? "[]"),
});

export const contriesSelector = selector({
  key: "contriesSelector",
  get: ({ get }) => {
    const countries = get(countriesState);
    return [
      countries.filter((country) => country.state === "WANT"),
      countries.filter((country) => country.state === "BEEN"),
      countries.filter((country) => country.state === "LIKE"),
    ];
  },
});
