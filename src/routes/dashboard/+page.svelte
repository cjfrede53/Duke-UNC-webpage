<script>
	import { onDestroy } from 'svelte';
	import Chart from 'chart.js/auto';
	import playersData from '$lib/data/players.json';

	// ✅ Study cart store (persists across pages)
	import { studyCart } from '$lib/stores/studyCart';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';

	// ---- Team + Roster ----
	let team = 'Duke'; // default

	$: roster = playersData
		.filter((p) => p.team === team)
		.map((p) => p.player_name)
		.sort((a, b) => a.localeCompare(b));

	let selectedPlayerName = '';
	let selectedPlayer = null;

	function onSelectPlayer() {
		if (!selectedPlayerName) return;
		selectedPlayer = playersData.find((p) => p.player_name === selectedPlayerName && p.team === team);
		queueMicrotask(renderChart);
	}

	// ---- Study cart helpers ----
	function isInCart(player) {
		return get(studyCart).some((p) => p.player_name === player.player_name && p.team === player.team);
	}

	function toggleCart(player) {
		if (!player) return;

		studyCart.update((items) => {
			const exists = items.some((p) => p.player_name === player.player_name && p.team === player.team);
			return exists
				? items.filter((p) => !(p.player_name === player.player_name && p.team === player.team))
				: [...items, player];
		});
	}

	function removeFromCart(player) {
		studyCart.update((items) =>
			items.filter((p) => !(p.player_name === player.player_name && p.team === player.team))
		);
	}

	function startQuiz() {
		goto('/quiz');
	}

	// ---- Chart.js (Minutes per game) ----
	let chartCanvas;
	let chart;

	function destroyChart() {
		chart?.destroy();
		chart = null;
	}

	function renderChart() {
		if (!selectedPlayer?.game_log?.length || !chartCanvas) return;

		const labels = selectedPlayer.game_log.map((g) => `Game ${g.game}`);
		const data = selectedPlayer.game_log.map((g) => Number(g.minutes) || 0);

		if (!chart) {
			chart = new Chart(chartCanvas, {
				type: 'bar',
				data: {
					labels,
					datasets: [
						{
							label: 'Minutes',
							data,
							borderWidth: 1,
							borderRadius: 10
						}
					]
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						legend: { display: true },
						title: {
							display: true,
							text: `Minutes per Game — ${selectedPlayer.player_name}`
						}
					},
					scales: {
						y: { beginAtZero: true }
					}
				}
			});
			return;
		}

		chart.data.labels = labels;
		chart.data.datasets[0].data = data;
		chart.options.plugins.title.text = `Minutes per Game — ${selectedPlayer.player_name}`;
		chart.update();
	}

	// When team changes, clear selection + chart
	$: if (team) {
		selectedPlayerName = '';
		selectedPlayer = null;
		destroyChart();
	}

	onDestroy(() => destroyChart());
</script>

<main class="page">
	<header class="header">
		<div class="titleBlock">
			<h1>Rivalry Player Dashboard</h1>
			<p class="sub">Select Duke or UNC → study players → add them to your Study List → quiz yourself.</p>
		</div>
	</header>

	<section class="grid">
		<!-- LEFT: Controls + Player stats -->
		<div class="card">
			<div class="cardTop">
				<h2>Controls</h2>
				<span class="pill">Local JSON dataset</span>
			</div>

			<label class="muted" style="display:block; margin-top:10px;">Team</label>
			<select class="select" bind:value={team}>
				<option value="Duke">Duke</option>
				<option value="UNC">UNC</option>
			</select>

			<label class="muted" style="display:block; margin-top:12px;">Select a player</label>
			<select class="select" bind:value={selectedPlayerName} on:change={onSelectPlayer}>
				<option value="" disabled selected>Choose a player…</option>
				{#each roster as name}
					<option value={name}>{name}</option>
				{/each}
			</select>

			{#if selectedPlayer}
				<div class="statsGrid">
					<div class="stat">
						<div class="statLabel">PPG</div>
						<div class="statValue">{selectedPlayer.stats?.ppg ?? '—'}</div>
					</div>
					<div class="stat">
						<div class="statLabel">RPG</div>
						<div class="statValue">{selectedPlayer.stats?.rpg ?? '—'}</div>
					</div>
					<div class="stat">
						<div class="statLabel">APG</div>
						<div class="statValue">{selectedPlayer.stats?.apg ?? '—'}</div>
					</div>
					<div class="stat">
						<div class="statLabel">MPG</div>
						<div class="statValue">{selectedPlayer.stats?.mpg ?? '—'}</div>
					</div>
				</div>

				<label class="cartToggle">
					<input
						type="checkbox"
						checked={isInCart(selectedPlayer)}
						on:change={() => toggleCart(selectedPlayer)}
					/>
					<span class="muted">Add to Study List</span>
				</label>
			{:else}
				<div class="muted" style="margin-top: 12px;">Pick a player to view stats.</div>
			{/if}
		</div>

		<!-- RIGHT: Chart -->
		<div class="card">
			<div class="cardTop">
				<h2>Visualization</h2>
				<span class="badge {team === 'Duke' ? 'duke' : 'unc'}">{team}</span>
			</div>

			<h2 style="margin-top: 4px;">Minutes per game</h2>
			<p class="muted" style="margin-top: 6px;">
				Bar chart of minutes played across the selected player's game log.
			</p>

			{#if selectedPlayer?.game_log?.length}
				<div class="chartWrap">
					<canvas bind:this={chartCanvas}></canvas>
				</div>
			{:else}
				<div class="muted" style="margin-top: 12px;">Select a player to visualize minutes.</div>
			{/if}
		</div>
	</section>

	<!-- ✅ STUDY LIST CART AT BOTTOM -->
	<section class="cartSection">
		<div class="cartTop">
			<h2>Study List</h2>
			<button class="btn" type="button" on:click={startQuiz} disabled={$studyCart.length === 0}>
				Start quiz ({$studyCart.length})
			</button>
		</div>

		{#if $studyCart.length === 0}
			<p class="muted">No players yet — add players as you study.</p>
		{:else}
			<div class="chips">
				{#each $studyCart as p (p.team + p.player_name)}
					<button class="chip" type="button" on:click={() => removeFromCart(p)}>
						<span class="chipTeam">{p.team}</span>
						<span>{p.player_name}</span>
						<span class="chipX">×</span>
					</button>
				{/each}
			</div>
		{/if}
	</section>

	<footer class="footer">
		<div class="muted">Made with Svelte + Chart.js + local JSON data.</div>
	</footer>
</main>

<style>
	/* Page */
	.page {
		min-height: 100vh;
		padding: 28px;
		background: radial-gradient(1200px 600px at 10% 0%, rgba(0, 120, 255, 0.12), transparent 60%),
			radial-gradient(1200px 600px at 90% 0%, rgba(0, 200, 120, 0.12), transparent 60%),
			#0b1020;
		color: #eaf0ff;
		font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		gap: 18px;
		margin-bottom: 18px;
	}

	.titleBlock {
		display: flex;
		flex-direction: column;
		gap: 6px;
	}

	h1 {
		margin: 0;
		font-size: 34px;
		letter-spacing: -0.02em;
	}

	.sub {
		margin: 0;
		color: rgba(234, 240, 255, 0.75);
	}

	.grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 14px;
	}

	@media (max-width: 900px) {
		.grid {
			grid-template-columns: 1fr;
		}
	}

	/* Cards */
	.card {
		background: rgba(255, 255, 255, 0.06);
		border: 1px solid rgba(255, 255, 255, 0.12);
		backdrop-filter: blur(10px);
		border-radius: 16px;
		padding: 16px;
		box-shadow: 0 10px 40px rgba(0, 0, 0, 0.35);
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

	.muted {
		color: rgba(234, 240, 255, 0.65);
	}

	.pill {
		font-size: 12px;
		padding: 6px 10px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.12);
		color: rgba(234, 240, 255, 0.8);
	}

	.badge {
		font-size: 12px;
		padding: 6px 10px;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.14);
		background: rgba(255, 255, 255, 0.06);
		color: rgba(234, 240, 255, 0.85);
		white-space: nowrap;
	}

	.badge.duke {
		border-color: rgba(0, 120, 255, 0.45);
		background: rgba(0, 120, 255, 0.18);
	}

	.badge.unc {
		border-color: rgba(120, 220, 255, 0.45);
		background: rgba(120, 220, 255, 0.16);
	}

	.select {
		width: 100%;
		margin-top: 6px;
		padding: 10px 12px;
		border-radius: 12px;
		border: 1px solid rgba(255, 255, 255, 0.14);
		background: rgba(255, 255, 255, 0.06);
		color: #eaf0ff;
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

	.statLabel {
		font-size: 12px;
		color: rgba(234, 240, 255, 0.65);
	}

	.statValue {
		font-size: 18px;
		font-weight: 700;
		margin-top: 4px;
	}

	.cartToggle {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-top: 12px;
	}

	.chartWrap {
		margin-top: 10px;
		height: 280px;
		border-radius: 14px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(255, 255, 255, 0.04);
		padding: 10px;
	}

	/* ✅ Study cart */
	.cartSection {
		margin-top: 18px;
		padding: 16px;
		border-radius: 16px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(255, 255, 255, 0.04);
	}

	.cartTop {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 12px;
		margin-bottom: 12px;
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
	}

	.chip {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding: 10px 12px;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.14);
		background: rgba(255, 255, 255, 0.06);
		color: #eaf0ff;
		cursor: pointer;
	}

	.chip:hover {
		background: rgba(255, 255, 255, 0.10);
	}

	.chipTeam {
		font-size: 12px;
		padding: 3px 8px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.10);
		border: 1px solid rgba(255, 255, 255, 0.12);
	}

	.chipX {
		opacity: 0.7;
	}

	/* Button */
	.btn {
		border: 1px solid rgba(255, 255, 255, 0.16);
		background: rgba(255, 255, 255, 0.08);
		color: #eaf0ff;
		padding: 10px 12px;
		border-radius: 12px;
		cursor: pointer;
	}

	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.footer {
		margin-top: 14px;
	}
</style>