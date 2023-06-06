import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useRecoilState, useRecoilValue } from "recoil";
import { ICountry, contriesSelector, countriesState } from "../atoms";

const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  padding-top: 3rem;
  max-width: 480px;
  margin: auto;
`;

const Header = styled.h1`
  font-weight: 700;
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.25rem;
  outline: none;
  background-color: #162028;
  color: #888;
  font-weight: 700;
  font-size: 1rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.25rem;
  outline: none;
  font-weight: 700;
  font-size: 1rem;
  margin-top: 1rem;
  color: #c8c8c8;
`;

const ContryContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0px 20px 0;

  p {
    font-weight: 700;
    font-size: 1.3rem;
    color: #c8c8c8;
  }

  button {
    padding: 0.75rem;
    border-radius: 0.25rem;
  }
`;

const Error = styled.h3`
  color: red;
  font-weight: 700;
  font-size: 0.75rem;
  margin-top: 15px;
  padding-left: 5px;
`;

interface IFrom {
  name: string;
}

const Home = () => {
  const [countries, setCountries] = useRecoilState(countriesState);
  const [want, been, like] = useRecoilValue(contriesSelector);
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<IFrom>();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const {
      currentTarget: { name },
    } = event;
    const id = (event.currentTarget as HTMLElement).parentElement?.id;
    const targetIndex = countries.findIndex(
      (country) => country.id + "" === id
    );

    const newCountry: ICountry = {
      ...countries[targetIndex],
      state: name as "WANT" | "BEEN" | "LIKE",
    };

    setCountries((countries) => {
      return [
        ...countries.slice(0, targetIndex),
        newCountry,
        ...countries.slice(targetIndex + 1),
      ];
    });
  };

  const onValid = ({ name }: IFrom) => {
    const exists = countries.findIndex((country) => country.name === name);
    console.log(exists);

    if (exists !== -1) {
      setError("name", {
        message: "이미 존재하는 나라입니다. 다른 나라를 입력하세요.",
      });
      return;
    }

    setCountries((prev) => [...prev, { name, id: Date.now(), state: "WANT" }]);
    setValue("name", "");
    localStorage.setItem("countries", JSON.stringify(countries));
  };

  return (
    <Container>
      <Header>내가 가고싶은 나라들</Header>
      <form onSubmit={handleSubmit(onValid)}>
        <Input
          {...register("name", {
            required: {
              value: true,
              message: "이름을 입력해주세요",
            },
          })}
          placeholder="이름"
        />
        {errors.name?.message && <Error>{errors.name?.message}</Error>}
        <Button>가자!</Button>
      </form>
      <br />
      <br />

      {want.map((country) => (
        <ContryContainer key={country.id} id={String(country.id)}>
          <p> {country.name}</p>
          <button name="BEEN" onClick={handleClick}>
            ✅
          </button>
          <button name="" onClick={handleClick}>
            🗑️
          </button>
        </ContryContainer>
      ))}

      <Header>내가 가본 나라들</Header>
      {been.map((country) => (
        <ContryContainer key={country.id} id={String(country.id)}>
          <p> {country.name}</p>
          <button name="LIKE" onClick={handleClick}>
            👍🏻
          </button>
          <button name="WANT" onClick={handleClick}>
            ❌
          </button>
        </ContryContainer>
      ))}

      <Header>내가 좋아하는 나라들</Header>
      {like.map((country) => (
        <ContryContainer key={country.id} id={String(country.id)}>
          <p> {country.name}</p>
          <button name="BEEN" onClick={handleClick}>
            👎🏻
          </button>
        </ContryContainer>
      ))}
    </Container>
  );
};

export default Home;
