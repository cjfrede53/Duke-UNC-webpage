<script>
	import { onDestroy } from 'svelte';

	const MODEL_URL = '/tm-my-image-model/';

	let tmImage;
	let model;

	let isLoadingModel = false;
	let status = 'Load the model, then upload a photo.';
	let predictions = [];
	let imageSrc = '';
	let imageEl;

	async function ensureLibrariesLoaded() {
		if (tmImage) return;
		await import('@tensorflow/tfjs');
		const tmImageModule = await import('@teachablemachine/image');
		tmImage = tmImageModule.default ?? tmImageModule;
	}

	async function loadModel() {
		if (model || isLoadingModel) return;
		isLoadingModel = true;
		status = 'Loading model…';

		try {
			await ensureLibrariesLoaded();
			model = await tmImage.load(`${MODEL_URL}model.json`, `${MODEL_URL}metadata.json`);
			status = 'Model loaded. Upload an image.';
		} catch (err) {
			console.error(err);
			status = 'Error loading model (check MODEL_URL + /static folder).';
		} finally {
			isLoadingModel = false;
		}
	}

	function onFileChange(e) {
		const file = e.currentTarget.files?.[0];
		if (!file) return;

		if (imageSrc) URL.revokeObjectURL(imageSrc);
		imageSrc = URL.createObjectURL(file);

		status = 'Image selected. Predicting…';
		predictions = [];
	}

	async function predictImage() {
		if (!model || !imageEl) return;

		try {
			const result = await model.predict(imageEl);
			predictions = result
				.map((r) => ({ className: r.className, probability: r.probability }))
				.sort((a, b) => b.probability - a.probability);

			status = 'Done.';
		} catch (err) {
			console.error(err);
			status = 'Prediction error (check console).';
		}
	}

	$: top = predictions[0] ?? { className: '', probability: 0 };
	$: topPct = Math.round((top.probability || 0) * 100);

	// Use probability to drive a simple “growth” value from 0..1
	$: growth = Math.min(1, Math.max(0, (top.probability || 0)));
	$: isDuke = top.className.toLowerCase().includes('duke');
	$: isUNC = top.className.toLowerCase().includes('unc');

	onDestroy(() => {
		if (imageSrc) URL.revokeObjectURL(imageSrc);
	});
</script>

<main class="page">
	<header class="header">
		<div>
			<h1>Rivalry Bloom</h1>
			<p class="sub">Upload a photo. The ecosystem reacts.</p>
		</div>

		<div class="actions">
			<button class="btn" type="button" on:click={loadModel} disabled={isLoadingModel || !!model}>
				{#if isLoadingModel}
					Loading…
				{:else if model}
					Model loaded ✓
				{:else}
					Load model
				{/if}
			</button>

			<label class="file {model ? '' : 'disabled'}">
				<input type="file" accept="image/*" on:change={onFileChange} disabled={!model} />
				<span>Upload image</span>
			</label>
		</div>
	</header>

	<section class="grid">
		<!-- LEFT: Upload + preview -->
		<div class="card">
			<div class="cardTop">
				<h2>Input</h2>
				<span class="pill">{status}</span>
			</div>

			{#if imageSrc}
				<img
					bind:this={imageEl}
					src={imageSrc}
					alt="Uploaded preview"
					class="preview"
					on:load={predictImage}
				/>
			{:else}
				<div class="empty">
					<div class="emptyIcon">📷</div>
					<div class="emptyText">
						<strong>No image yet</strong>
						<div class="muted">Upload a Duke or UNC photo to test your model.</div>
					</div>
				</div>
			{/if}
		</div>

		<!-- RIGHT: Results + “biomimicry” reaction -->
		<div class="card">
			<div class="cardTop">
				<h2>Classification</h2>

				{#if top.className}
					<span class="badge {isDuke ? 'duke' : isUNC ? 'unc' : ''}">
						{top.className} · {topPct}%
					</span>
				{:else}
					<span class="badge">Waiting…</span>
				{/if}
			</div>

			{#if predictions.length}
				<div class="bars">
					{#each predictions as p (p.className)}
						<div class="row">
							<div class="rowLabel">
								<span class="name">{p.className}</span>
								<span class="pct">{Math.round(p.probability * 100)}%</span>
							</div>
							<div class="track">
								<div class="fill" style="width: {p.probability * 100}%"></div>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="muted">Your prediction results will appear here.</div>
			{/if}

			<div class="divider"></div>

			<h2>Ecosystem response</h2>
			<p class="muted">
				A simple biomimicry metaphor: team signals act like environmental cues—growth vs. stress.
			</p>

			<!-- plant scene -->
			<div class="scene">
				<div class="sun {isDuke ? 'on' : ''}"></div>

				<!-- stem grows with probability -->
				<div class="stem" style="transform: scaleY({0.2 + growth * 0.9});"></div>

				<!-- bloom vs droop -->
				<div class="bloom {isUNC ? 'droop' : ''}" style="transform: scale({0.7 + growth * 0.5});">
					<div class="petal p1"></div>
					<div class="petal p2"></div>
					<div class="petal p3"></div>
					<div class="petal p4"></div>
					<div class="center"></div>
				</div>

				<div class="ground"></div>
			</div>
		</div>
	</section>

	<footer class="footer">
		<div class="muted">
			Tip: train with consistent logos/colors and a few “Other” images to reduce misfires.
		</div>
	</footer>
</main>

<style>
	/* Layout */
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

	h1 {
		margin: 0;
		font-size: 34px;
		letter-spacing: -0.02em;
	}

	.sub {
		margin: 6px 0 0;
		color: rgba(234, 240, 255, 0.75);
	}

	.actions {
		display: flex;
		gap: 10px;
		align-items: center;
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

	.divider {
		height: 1px;
		background: rgba(255, 255, 255, 0.12);
		margin: 14px 0;
	}

	/* Buttons */
	.btn {
		border: 1px solid rgba(255, 255, 255, 0.16);
		background: rgba(255, 255, 255, 0.08);
		color: #eaf0ff;
		padding: 10px 12px;
		border-radius: 12px;
		cursor: pointer;
		transition: transform 120ms ease, background 120ms ease, border 120ms ease;
	}

	.btn:hover {
		transform: translateY(-1px);
		background: rgba(255, 255, 255, 0.12);
		border-color: rgba(255, 255, 255, 0.22);
	}

	.btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
	}

	.file {
		border: 1px dashed rgba(255, 255, 255, 0.22);
		background: rgba(255, 255, 255, 0.06);
		color: rgba(234, 240, 255, 0.9);
		padding: 10px 12px;
		border-radius: 12px;
		cursor: pointer;
		user-select: none;
	}

	.file input {
		display: none;
	}

	.file.disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	/* Status pills */
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

	/* Preview */
	.preview {
		width: 100%;
		max-height: 420px;
		object-fit: cover;
		border-radius: 14px;
		border: 1px solid rgba(255, 255, 255, 0.12);
	}

	.empty {
		display: flex;
		align-items: center;
		gap: 12px;
		padding: 22px;
		border-radius: 14px;
		border: 1px dashed rgba(255, 255, 255, 0.18);
		background: rgba(255, 255, 255, 0.04);
	}

	.emptyIcon {
		font-size: 30px;
	}

	/* Prediction bars */
	.bars {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.rowLabel {
		display: flex;
		justify-content: space-between;
		font-size: 13px;
		margin-bottom: 6px;
		color: rgba(234, 240, 255, 0.9);
	}

	.track {
		height: 10px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.08);
		border: 1px solid rgba(255, 255, 255, 0.10);
		overflow: hidden;
	}

	.fill {
		height: 100%;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.55);
		transition: width 250ms ease;
	}

	/* “Plant” scene */
	.scene {
		position: relative;
		height: 240px;
		margin-top: 10px;
		border-radius: 16px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: radial-gradient(500px 200px at 50% 0%, rgba(255, 255, 255, 0.10), transparent 55%),
			linear-gradient(180deg, rgba(30, 60, 120, 0.25), rgba(0, 0, 0, 0.2));
		overflow: hidden;
	}

	.sun {
		position: absolute;
		top: 18px;
		right: 18px;
		width: 36px;
		height: 36px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.18);
		filter: blur(0.2px);
		transform: scale(0.95);
		transition: transform 300ms ease, background 300ms ease;
	}

	.sun.on {
		background: rgba(255, 255, 255, 0.45);
		transform: scale(1.05);
		box-shadow: 0 0 24px rgba(255, 255, 255, 0.22);
	}

	.ground {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 54px;
		background: rgba(10, 18, 30, 0.65);
		border-top: 1px solid rgba(255, 255, 255, 0.10);
	}

	.stem {
		position: absolute;
		bottom: 54px;
		left: 50%;
		width: 10px;
		height: 130px;
		transform-origin: bottom;
		transform: scaleY(0.2);
		border-radius: 999px;
		background: rgba(120, 255, 170, 0.65);
		filter: drop-shadow(0 6px 8px rgba(0, 0, 0, 0.35));
		transition: transform 350ms ease;
	}

	.bloom {
		position: absolute;
		bottom: 54px;
		left: 50%;
		width: 96px;
		height: 96px;
		transform-origin: center;
		transform: translateX(-50%) scale(0.9);
		transition: transform 350ms ease;
	}

	/* droop on UNC */
	.bloom.droop {
		transform: translateX(-50%) rotate(16deg) scale(0.85);
		filter: saturate(0.5);
		opacity: 0.85;
	}

	.petal {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 44px;
		height: 22px;
		border-radius: 999px;
		background: rgba(255, 255, 255, 0.55);
		transform-origin: left center;
	}

	.p1 { transform: translate(-10%, -50%) rotate(0deg); }
	.p2 { transform: translate(-10%, -50%) rotate(90deg); }
	.p3 { transform: translate(-10%, -50%) rotate(180deg); }
	.p4 { transform: translate(-10%, -50%) rotate(270deg); }

	.center {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 20px;
		height: 20px;
		border-radius: 999px;
		transform: translate(-50%, -50%);
		background: rgba(255, 255, 255, 0.75);
	}

	.footer {
		margin-top: 14px;
	}
</style>

