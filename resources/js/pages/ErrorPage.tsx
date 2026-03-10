import { useRouteError } from 'react-router-dom';

const ErrorPage: React.FC = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <div className='w-full h-screen flex flex-col gap-10 justify-center items-center'>
      <h1 className='text-6xl text-textColor font-bold'>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      {error ? (
        <p>
          <i className='text-[#818181] text-lg'>{(error as any).statusText || (error as any).message}</i>
        </p>
      ) : (
        <p>
          <i className='text-[#818181] text-lg'>Not Found</i>
        </p>
      )}
    </div>
  );
};

export default ErrorPage;
