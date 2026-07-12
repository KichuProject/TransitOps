import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { INITIAL_USERS } from '../constants/mockData';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import ShinyText from '../components/reactbits/ShinyText';
import SpotlightCard from '../components/reactbits/SpotlightCard';

export const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: {
      email: INITIAL_USERS[0].email,
      password: INITIAL_USERS[0].password,
    }
  });

  const onSubmit = async (data) => {
    const success = await login(data.email, data.password);
    if (success) {
      navigate('/');
    }
  };

  const handleDemoSelect = (user) => {
    setValue('email', user.email);
    setValue('password', user.password);
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-950 to-slate-950 px-6 py-12 select-none">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white font-bold text-base shadow-xl shadow-blue-500/20 mb-3 select-none">
            TO
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
            Sign in to <ShinyText text="TransitOps" speed={6} className="font-extrabold text-xl" />
          </h2>
          <p className="mt-1 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Fleet Intelligence Portal
          </p>
        </div>

        {/* Login Form Container */}
        <SpotlightCard className="w-full p-8 border-slate-800/80 bg-slate-900/40 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <Input
              label="Work Email Address"
              type="email"
              placeholder="name@transitops.com"
              className="bg-slate-950 border-slate-800 text-white focus:border-blue-500 placeholder-slate-600 focus:ring-1 focus:ring-blue-500"
              error={errors.email}
              {...register('email', { required: 'Email address is required' })}
            />

            <Input
              label="Security Password"
              type="password"
              placeholder="••••••••"
              className="bg-slate-950 border-slate-800 text-white focus:border-blue-500 placeholder-slate-600 focus:ring-1 focus:ring-blue-500"
              error={errors.password}
              {...register('password', { required: 'Password is required' })}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-2 py-2.5 font-bold shadow-lg shadow-blue-600/10"
            >
              Sign In
            </Button>
          </form>

          {/* Quick selectors for demo roles */}
          <div className="mt-8 pt-6 border-t border-slate-800/80">
            <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-3.5">
              Prefilled Demo Accounts
            </span>
            <div className="grid grid-cols-2 gap-2">
              {INITIAL_USERS.map((user) => (
                <button
                  key={user.role}
                  type="button"
                  onClick={() => handleDemoSelect(user)}
                  className="flex flex-col p-2 bg-slate-950/40 hover:bg-slate-950/80 border border-slate-850/80 hover:border-slate-800 rounded-lg text-left transition-all group"
                >
                  <span className="text-[10px] font-bold text-slate-300 group-hover:text-white truncate">{user.name}</span>
                  <span className="text-[8px] text-blue-400 font-bold mt-1.5 uppercase tracking-wider leading-none">
                    {user.role}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </SpotlightCard>
      </div>
    </div>
  );
};

export default Login;
