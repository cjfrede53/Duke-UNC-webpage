<script>
	import { goto } from '$app/navigation';
</script>

<main class="home">
	<div class="heroCard">
		<h1>Rivalry Tenting Test</h1>

		<p class="tagline">
			Think you know the roster?
		</p>

		<p class="description">
			Welcome to the ultimate Duke vs UNC tenting prep tool.
			<br /><br />
			Need to memorize player stats so you don’t let your team down on the UNC tenting test?
			Study smart. Lock in. Dominate the quiz.
		</p>

		<div class="features">
			<div class="feature">
				📊 Study real player stats
			</div>
			<div class="feature">
				📈 Visualize minutes per game
			</div>
			<div class="feature">
				🧠 Build your custom quiz
			</div>
		</div>

		<div class="buttons">
			<button class="primary" on:click={() => goto('/dashboard')}>
				Start Studying
			</button>

			<button class="secondary" on:click={() => goto('/quiz')}>
				Take the Quiz
			</button>
		</div>

		<p class="subtle">
			No excuses. No blown questions. No embarrassment in line.
		</p>
	</div>
</main>

<style>
	.home {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 40px;
		background: radial-gradient(1000px 600px at 10% 0%, rgba(0, 120, 255, 0.2), transparent 60%),
			radial-gradient(1000px 600px at 90% 0%, rgba(120, 200, 255, 0.15), transparent 60%),
			#0b1020;
		color: #eaf0ff;
		font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
	}

	.heroCard {
		max-width: 720px;
		text-align: center;
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.12);
		border-radius: 20px;
		padding: 48px 36px;
		backdrop-filter: blur(12px);
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
	}

	h1 {
		margin: 0;
		font-size: 42px;
		letter-spacing: -0.02em;
	}

	.tagline {
		margin-top: 12px;
		font-size: 18px;
		color: rgba(234, 240, 255, 0.8);
	}

	.description {
		margin-top: 24px;
		font-size: 16px;
		line-height: 1.6;
		color: rgba(234, 240, 255, 0.75);
	}

	.features {
		margin-top: 32px;
		display: grid;
		gap: 12px;
	}

	.feature {
		padding: 12px;
		border-radius: 12px;
		background: rgba(255, 255, 255, 0.05);
		border: 1px solid rgba(255, 255, 255, 0.1);
		font-size: 14px;
	}

	.buttons {
		margin-top: 36px;
		display: flex;
		justify-content: center;
		gap: 16px;
		flex-wrap: wrap;
	}

	button {
		padding: 12px 22px;
		border-radius: 14px;
		font-weight: 600;
		cursor: pointer;
		border: none;
		transition: all 150ms ease;
	}

	.primary {
		background: linear-gradient(135deg, #0055ff, #2a9cff);
		color: white;
	}

	.primary:hover {
		transform: translateY(-2px);
		box-shadow: 0 10px 30px rgba(0, 85, 255, 0.4);
	}

	.secondary {
		background: rgba(255, 255, 255, 0.08);
		color: #eaf0ff;
		border: 1px solid rgba(255, 255, 255, 0.15);
	}

	.secondary:hover {
		background: rgba(255, 255, 255, 0.14);
		transform: translateY(-2px);
	}

	.subtle {
		margin-top: 32px;
		font-size: 13px;
		color: rgba(234, 240, 255, 0.55);
	}
</style>