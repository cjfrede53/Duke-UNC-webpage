<script>
	import { studyCart } from '$lib/stores/studyCart';
	import { goto } from '$app/navigation';

	let i = 0;
	let showAnswer = false;

	$: players = $studyCart;
	$: current = players[i];

	function next() {
		if (!players.length) return;
		i = (i + 1) % players.length;
		showAnswer = false;
	}

	function prev() {
		if (!players.length) return;
		i = (i - 1 + players.length) % players.length;
		showAnswer = false;
	}

	function shuffle() {
		studyCart.update((items) => {
			const a = [...items];
			for (let j = a.length - 1; j > 0; j--) {
				const k = Math.floor(Math.random() * (j + 1));
				[a[j], a[k]] = [a[k], a[j]];
			}
			return a;
		});
		i = 0;
		showAnswer = false;
	}

	function clearList() {
		studyCart.set([]);
		i = 0;
		showAnswer = false;
	}
</script>

<main class="page">
	<header class="header">
		<div class="titleBlock">
			<h1>Quiz Mode</h1>
			<p class="sub">Study list → quiz yourself (reveal answers when ready).</p>
		</div>
		<div class="headerBtns">
			<button class="btn" on:click={() => goto('/')}>Back</button>
			<button class="btn" on:click={shuffle} disabled={$studyCart.length < 2}>Shuffle</button>
			<button class="btn" on:click={clearList} disabled={$studyCart.length === 0}>Clear</button>
		</div>
	</header>

	{#if $studyCart.length === 0}
		<div class="card">
			<p class="muted">Your Study List is empty. Go back and add players first.</p>
		</div>
	{:else}
		<div class="card">
			<div class="cardTop">
				<h2>Card {i + 1} / {$studyCart.length}</h2>
				<span class="pill">{current.team}</span>
			</div>

			<div class="prompt">
				<div class="muted">Player:</div>
				<div class="big">{showAnswer ? current.player_name : '????'}</div>
			</div>

			<div class="divider"></div>

			<div class="prompt">
				<div class="muted">Recall stats (PPG / RPG / APG / MPG)</div>

				{#if showAnswer}
					<div class="statsGrid">
						<div class="stat"><div class="statLabel">PPG</div><div class="statValue">{current.stats?.ppg ?? '—'}</div></div>
						<div class="stat"><div class="statLabel">RPG</div><div class="statValue">{current.stats?.rpg ?? '—'}</div></div>
						<div class="stat"><div class="statLabel">APG</div><div class="statValue">{current.stats?.apg ?? '—'}</div></div>
						<div class="stat"><div class="statLabel">MPG</div><div class="statValue">{current.stats?.mpg ?? '—'}</div></div>
					</div>
				{:else}
					<p class="muted" style="margin-top: 8px;">Try from memory, then hit Reveal.</p>
				{/if}
			</div>

			<div class="actions">
				<button class="btn" on:click={prev}>Prev</button>
				<button class="btn" on:click={() => (showAnswer = !showAnswer)}>
					{showAnswer ? 'Hide' : 'Reveal'}
				</button>
				<button class="btn" on:click={next}>Next</button>
			</div>
		</div>
	{/if}
</main>

<style>
	.page {
		min-height: 100vh;
		padding: 28px;
		background: #0b1020;
		color: #eaf0ff;
		font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 18px;
		margin-bottom: 18px;
		flex-wrap: wrap;
	}

	.titleBlock { display: flex; flex-direction: column; gap: 6px; }
	h1 { margin: 0; font-size: 34px; letter-spacing: -0.02em; }
	.sub { margin: 0; color: rgba(234, 240, 255, 0.75); }

	.headerBtns { display: flex; gap: 10px; flex-wrap: wrap; }

	.card {
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.12);
		backdrop-filter: blur(10px);
		border-radius: 16px;
		padding: 16px;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.35);
		max-width: 900px;
	}

	.cardTop {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 10px;
		margin-bottom: 12px;
	}

	h2 {
		margin: 0;
		font-size: 16px;
		letter-spacing: 0.02em;
		text-transform: uppercase;
		color: rgba(234, 240, 255, 0.85);
	}

	.muted { color: rgba(234, 240, 255, 0.65); }

	.pill {
		font-size: 12px;
		padding: 6px 10px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.12);
		color: rgba(234, 240, 255, 0.8);
	}

	.divider {
		height: 1px;
		background: rgba(255, 255, 255, 0.12);
		margin: 14px 0;
	}

	.big {
		font-size: 38px;
		font-weight: 900;
		margin-top: 8px;
		letter-spacing: -0.02em;
	}

	.statsGrid {
		margin-top: 12px;
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 10px;
	}

	.stat {
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(255, 255, 255, 0.05);
		border-radius: 14px;
		padding: 10px;
	}

	.statLabel { font-size: 12px; color: rgba(234, 240, 255, 0.65); }
	.statValue { font-size: 18px; font-weight: 700; margin-top: 4px; }

	.actions {
		display: flex;
		gap: 10px;
		margin-top: 14px;
		flex-wrap: wrap;
	}

	.btn {
		border: 1px solid rgba(255, 255, 255, 0.16);
		background: rgba(255, 255, 255, 0.08);
		color: #eaf0ff;
		padding: 10px 12px;
		border-radius: 12px;
		cursor: pointer;
	}

	.btn:disabled { opacity: 0.6; cursor: not-allowed; }
</style>