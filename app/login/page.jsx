import { LoginForm } from "./_components/LoginForm";

const LoginPage = () => {
  return (
    <div className="w-full flex-col h-screen flex items-center justify-center">
      <div className="container mx-auto">
        <LoginForm />
      </div>
    </div>
  );
};
export default LoginPage;
