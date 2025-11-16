export const getFilms = async (queryParams: Record<string, string>) => {
  const params = new URLSearchParams();
  Object.entries(queryParams).forEach((param) => {
    params.set(param[0], String(param[1]));
  });

  const response = await fetch(
    (process.env.SERVICE_URL as string) + params.toString(),
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
  );

  const data = await response.json();

  return data;
};
