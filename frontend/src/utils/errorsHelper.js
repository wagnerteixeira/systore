export const getErrosFromApi = error => {
  console.log(error);
  console.log(error.response);
  console.log(error.message);
  if (error.response) {
    console.log(error.response.status);
    console.log(typeof error.response.data);
    if (error.response.data) {
      if (error.response.data.message) return error.response.data.message;
      else
        return Object.values(error.response.data).reduce(
          (resultError, currentError) => `${resultError}${currentError}\n`,
          ''
        );
    } else return JSON.stringify(error.response);
  } else if (error) {
    if (error.message) {
      if (error.message === 'Network Error')
        return 'Falha de conexão com o servidor, verifique sua conexão e tente novamente.';
      else return error.message;
    } else return JSON.stringify(error);
  } else
    return 'Erro ao executar operação, tente novamente ou entre em contato com o suporte';
};