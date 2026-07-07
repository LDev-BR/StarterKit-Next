'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Shield, 
  ArrowLeft,
  Terminal,
  Cpu,
  Key,
  Database
} from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email({ message: 'Insira um e-mail corporativo válido.' }),
  password: z.string().min(6, { message: 'A senha de acesso deve possuir pelo menos 6 caracteres.' }),
});

const registerSchema = z.object({
  name: z.string().min(2, { message: 'Nome deve ter no mínimo 2 caracteres.' }),
  email: z.string().email({ message: 'Insira um e-mail corporativo válido.' }),
  password: z.string().min(8, { message: 'Sua senha de segurança deve conter no mínimo 8 caracteres.' }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas devem coincidir.',
  path: ['confirmPassword'],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export function AuthShowcase() {
  const { authView, setAuthView, login, addNotification } = useAppStore();
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Hook-form for login
  const {
    register: regLogin,
    handleSubmit: handleLogin,
    formState: { errors: loginErrors },
    reset: resetLogin,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: 'admin@starterkit.io', password: 'master_password' },
  });

  // Hook-form for registration
  const {
    register: regRegister,
    handleSubmit: handleRegister,
    formState: { errors: regErrors },
    reset: resetRegister,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onLogin = (data: LoginFormValues) => {
    setSubmitting(true);
    setTimeout(() => {
      login(data.email, data.email.split('@')[0]);
      addNotification('Sessão restaurada e assinada com JWT.', 'success');
      setSubmitting(false);
      resetLogin();
    }, 600);
  };

  const onRegister = (data: RegisterFormValues) => {
    setSubmitting(true);
    setTimeout(() => {
      login(data.email, data.name);
      addNotification('Cadastro realizado com sucesso!', 'success');
      setSubmitting(false);
      resetRegister();
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background grid grid-cols-1 lg:grid-cols-12 select-none relative overflow-x-hidden text-left font-sans text-foreground">
      
      {/* Absolute Header to Go Back */}
      <div className="absolute top-6 left-6 z-30">
        <button
          onClick={() => setAuthView('landing')}
          className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-muted-foreground hover:text-foreground transition-all cursor-pointer bg-card/40 border border-border px-3.5 py-1.5 rounded-lg backdrop-blur-xs"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao Início
        </button>
      </div>

      {/* LEFT COLUMN: Premium High-Definition Graphic Sidebar & Corporate Trust Block */}
      <div className="hidden lg:flex lg:col-span-5 bg-card border-r border-border flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-card/80 via-muted/5 to-card/60">
        <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none" />
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
        
        {/* Logo/Branding Block */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="h-9 w-9 bg-primary rounded-lg flex items-center justify-center shadow-lg">
            <div className="w-4.5 h-4.5 border-2 border-primary-foreground rotate-45 rounded-sm" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-black tracking-wider text-foreground uppercase">SaaS Starter</span>
            <span className="text-[9px] text-primary font-black uppercase tracking-widest leading-none mt-0.5">ESTRUTURA ATIVA</span>
          </div>
        </div>

        {/* Dynamic Architectural Statement */}
        <div className="space-y-6 relative z-10 my-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-0.5 text-[8px] font-black uppercase tracking-widest text-primary">
            <Terminal className="h-3.5 w-3.5" /> SECURE AUDIT IN PROGRESS
          </div>
          <h2 className="text-3xl font-black tracking-tight leading-tight text-foreground uppercase">
            Acesso ao <br />
            Portal Corporativo.
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
            Para auditar o Zustand logflow, projetos estruturados, parâmetros mockados e simulações de API, autentique-se abaixo com uma conta demonstrativa.
          </p>

          <div className="pt-4 space-y-3.5">
            <div className="flex items-center gap-3 text-xs">
              <Shield className="h-4.5 w-4.5 text-primary shrink-0" />
              <span className="text-muted-foreground font-semibold">Criptografia Local Segura por Token JWT</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <Cpu className="h-4.5 w-4.5 text-primary shrink-0" />
              <span className="text-muted-foreground font-semibold">Mock Connectors acoplados de fábrica</span>
            </div>
          </div>
        </div>

        {/* Footer/Meta specifications */}
        <div className="flex items-center justify-between relative z-10 text-[9px] font-black text-muted-foreground uppercase tracking-widest border-t border-border/80 pt-6">
          <span>PORTAL DE CONTAS v1.2</span>
          <span>NESTJS READY</span>
        </div>
      </div>

      {/* RIGHT COLUMN: Dedicated dynamic form container */}
      <div className="lg:col-span-7 flex items-center justify-center p-6 md:p-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[120px] pointer-events-none z-0" />
        
        <div className="w-full max-w-md relative z-10">
          <AnimatePresence mode="wait">
            {authView === 'login' ? (
              
              /* SIGN IN FORM DEDICATED SCREEN */
              <motion.div
                key="login-view-card"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-2xl font-black uppercase tracking-tight text-foreground">
                    Iniciar Sessão
                  </h1>
                  <p className="text-xs text-muted-foreground mt-1 font-semibold">
                    Insira suas credenciais abaixo para entrar no Painel Geral.
                  </p>
                </div>

                <form onSubmit={handleLogin(onLogin)} className="space-y-4">
                  <div className="space-y-3.5">
                    <Input
                      label="E-mail de Trabalho"
                      placeholder="seu-email@sua-empresa.com"
                      error={loginErrors.email?.message}
                      {...regLogin('email')}
                    />

                    <div className="space-y-1 relative">
                      <Input
                        label="Sua Senha de Acesso"
                        type={showPass ? 'text' : 'password'}
                        placeholder="••••••••••••"
                        error={loginErrors.password?.message}
                        {...regLogin('password')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-3.5 top-9.5 text-muted-foreground hover:text-foreground cursor-pointer"
                      >
                        {showPass ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      id="btn-perform-login"
                      type="submit"
                      className="w-full h-10 font-bold text-xs uppercase"
                      isLoading={submitting}
                    >
                      Autenticar e Entrar
                    </Button>
                  </div>
                </form>

                <div className="text-center bg-muted/20 border border-border/80 rounded-xl p-4.5">
                  <span className="text-[10px] uppercase font-black tracking-wider text-muted-foreground">Credenciais rápidas de demonstração:</span>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center items-center mt-2.5">
                    <code className="text-[9px] bg-card border border-border/60 px-2 py-1 rounded font-mono select-all text-foreground font-black">admin@starterkit.io</code>
                    <span className="text-muted-foreground hidden sm:inline">|</span>
                    <code className="text-[9px] bg-card border border-border/60 px-2 py-1 rounded font-mono select-all text-foreground font-black">master_password</code>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <p className="text-xs text-muted-foreground font-semibold">
                    Ainda não tem cadastro?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthView('register')}
                      className="text-primary font-black hover:underline cursor-pointer uppercase tracking-tight"
                    >
                      Criar conta agora
                    </button>
                  </p>
                </div>
              </motion.div>

            ) : (

              /* SIGN UP FORM DEDICATED SCREEN */
              <motion.div
                key="register-view-card"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div>
                  <h1 className="text-2xl font-black uppercase tracking-tight text-foreground">
                    Criar Nova Conta
                  </h1>
                  <p className="text-xs text-muted-foreground mt-1 font-semibold">
                    Preencha o formulário para registrar uma conta corporativa de testes.
                  </p>
                </div>

                <form onSubmit={handleRegister(onRegister)} className="space-y-4">
                  <div className="space-y-3">
                    <Input
                      label="Nome Completo"
                      placeholder="Ex: Luis Tavares"
                      error={regErrors.name?.message}
                      {...regRegister('name')}
                    />

                    <Input
                      label="E-mail Profissional"
                      placeholder="seu-email@sua-empresa.com"
                      error={regErrors.email?.message}
                      {...regRegister('email')}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1 relative">
                        <Input
                          label="Nova Senha"
                          type={showPass ? 'text' : 'password'}
                          placeholder="••••••••"
                          error={regErrors.password?.message}
                          {...regRegister('password')}
                        />
                      </div>

                      <div className="space-y-1">
                        <Input
                          label="Confirmar Senha"
                          type={showPass ? 'text' : 'password'}
                          placeholder="••••••••"
                          error={regErrors.confirmPassword?.message}
                          {...regRegister('confirmPassword')}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      id="btn-perform-register"
                      type="submit"
                      className="w-full h-10 font-bold text-xs uppercase"
                      isLoading={submitting}
                    >
                      Criar Conta e Iniciar
                    </Button>
                  </div>
                </form>

                <div className="text-center pt-2">
                  <p className="text-xs text-muted-foreground font-semibold">
                    Já possui registro?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthView('login')}
                      className="text-primary font-black hover:underline cursor-pointer uppercase tracking-tight"
                    >
                      Fazer logon
                    </button>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default AuthShowcase;
