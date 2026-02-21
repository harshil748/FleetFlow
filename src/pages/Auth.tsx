import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { toast } from "sonner";

export default function Auth() {
	const navigate = useNavigate();
	const [loginEmail, setLoginEmail] = useState("");
	const [loginPassword, setLoginPassword] = useState("");
	const [regEmail, setRegEmail] = useState("");
	const [regPassword, setRegPassword] = useState("");
	const [regName, setRegName] = useState("");
	const [regConfirm, setRegConfirm] = useState("");
	const [loading, setLoading] = useState(false);

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		const { error } = await supabase.auth.signInWithPassword({
			email: loginEmail,
			password: loginPassword,
		});
		setLoading(false);
		if (error) {
			toast.error(error.message);
		} else {
			navigate("/dashboard");
		}
	};

	const handleRegister = async (e: React.FormEvent) => {
		e.preventDefault();
		if (regPassword !== regConfirm) {
			toast.error("Passwords do not match");
			return;
		}
		setLoading(true);
		const { data, error } = await supabase.auth.signUp({
			email: regEmail,
			password: regPassword,
			options: { data: { display_name: regName } },
		});
		setLoading(false);
		if (error) {
			toast.error(error.message);
		} else if (data.session) {
			// Email confirmation disabled — session created immediately
			navigate("/dashboard");
		} else {
			toast.success("Account created! Please log in.");
		}
	};

	return (
		<div
			className='min-h-screen flex items-center justify-center bg-background p-4'
			style={{
				background:
					"radial-gradient(ellipse at 50% 50%, hsl(0 0% 5%) 0%, hsl(0 0% 0%) 100%)",
			}}>
			<div className='flex flex-col md:flex-row gap-8 w-full max-w-4xl'>
				{/* Login Card */}
				<form
					onSubmit={handleLogin}
					className='flex-1 glass-strong rounded-2xl p-8 neon-border flex flex-col items-center gap-6'>
					<div className='w-20 h-20 rounded-full glass neon-border flex items-center justify-center'>
						<User className='w-10 h-10 text-primary' />
					</div>
					<h2 className='text-xl font-bold neon-text'>Login</h2>
					<Input
						placeholder='Email'
						type='email'
						value={loginEmail}
						onChange={(e) => setLoginEmail(e.target.value)}
						className='glass border-border/40 focus:neon-border'
						required
					/>
					<Input
						placeholder='Password'
						type='password'
						value={loginPassword}
						onChange={(e) => setLoginPassword(e.target.value)}
						className='glass border-border/40 focus:neon-border'
						required
					/>
					<Button
						type='submit'
						disabled={loading}
						className='w-full neon-button font-semibold'>
						{loading ? "Signing in..." : "Login"}
					</Button>
				</form>

				{/* Register Card */}
				<form
					onSubmit={handleRegister}
					className='flex-1 glass-strong rounded-2xl p-8 neon-border flex flex-col items-center gap-6'>
					<div className='w-20 h-20 rounded-full glass neon-border flex items-center justify-center'>
						<User className='w-10 h-10 text-primary' />
					</div>
					<h2 className='text-xl font-bold neon-text'>Register</h2>
					<Input
						placeholder='Full Name'
						value={regName}
						onChange={(e) => setRegName(e.target.value)}
						className='glass border-border/40 focus:neon-border'
						required
					/>
					<Input
						placeholder='Email'
						type='email'
						value={regEmail}
						onChange={(e) => setRegEmail(e.target.value)}
						className='glass border-border/40 focus:neon-border'
						required
					/>
					<Input
						placeholder='Password'
						type='password'
						value={regPassword}
						onChange={(e) => setRegPassword(e.target.value)}
						className='glass border-border/40 focus:neon-border'
						required
					/>
					<Input
						placeholder='Confirm Password'
						type='password'
						value={regConfirm}
						onChange={(e) => setRegConfirm(e.target.value)}
						className='glass border-border/40 focus:neon-border'
						required
					/>
					<Button
						type='submit'
						disabled={loading}
						className='w-full neon-button font-semibold'>
						{loading ? "Creating account..." : "Register"}
					</Button>
				</form>
			</div>
		</div>
	);
}
