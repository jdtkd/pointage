import { SignUp } from '@clerk/nextjs';
    
const page = () => {
  return (
    <div className="hero bg-base-100 rounded-box p-6 mb-6">
      <div className="hero-content text-center">
        <div className="max-w-md">
            <SignUp />
        </div>
      </div>
    </div>
  );
};

export default page;


