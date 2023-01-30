<script lang="ts">
	import { isShowing, newBountyValue, trigger_new_bounty } from './store_bounty';
	import { fade } from 'svelte/transition';

	let nameField: string = '';
	let descField: string = '';

	const MINIMUM_NAME_LENGTH = 3; // Consider to put in the .env file
	const MINIMUM_DESC_LENGTH = 10;
	function handleChange(type: string) {
		switch (type) {
			case 'name':
				nameField = $newBountyValue.name.length < MINIMUM_NAME_LENGTH ? 'Minimum 3 character.' : '';
				break;
			case 'desc':
				descField =
					$newBountyValue.description.length <= MINIMUM_DESC_LENGTH ? 'Minimum 10 character.' : '';
				break;
		}
	}

	function handleSubmit(e: Event) {
		let submittedForm = e.target as HTMLFormElement;
		if (
			(submittedForm.elements[0] as HTMLInputElement).value.length < MINIMUM_NAME_LENGTH ||
			(submittedForm.elements[1] as HTMLTextAreaElement).value.length < MINIMUM_DESC_LENGTH
		) {
			return 1;
		}
		if (submittedForm) {
			let fileInput = submittedForm.elements[2] as HTMLInputElement;
			console.log(fileInput)
			if (fileInput.files) {
				const mbytes = fileInput.files[0].size / (1024 * 1024);
				if (fileInput.files[0].type.split('/')[0] != 'image' || mbytes > 20) {
					// Error handling - Frontend
					console.log('file error');
					return 1;
				}
			} else {
				return 1;
			}
			submittedForm.submit();
		}
	}
</script>

{#if $isShowing}
	<div
		class="relative z-10 h-full overflow-hidden"
		aria-labelledby="modal-title"
		role="dialog"
		aria-modal="true"
		transition:fade={{ duration: 300 }}
	>
		<div class="fixed inset-0 bgCover bg-opacity-75 overflow-y-hidden" />

		<div class="fixed inset-0 z-10 overflow-y-hidden h-auto">
			<div class="flex h-full justify-center text-center items-center md:p-0 overflow-y-hidden">
				<div
					class="relative transform overflow-y-hidden rounded-lg  text-left shadow-xl d:my-8 md:w-full md:max-w-lg"
					transition:fade={{ duration: 300 }}
				>
					{#if $trigger_new_bounty}
						<form
							method="POST"
							id="newBountyForm"
							action="?/program"
							enctype="multipart/form-data"
							on:submit|preventDefault={handleSubmit}
						>
							<div class="bg-white px-10 md:px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<div class="right-5 top-3 absolute">
									<i
										class="material-icons text-red-500 cursor-pointer"
										on:click={() => {
											isShowing.set(false);
										}}>close</i
									>
								</div>
								<div class="sm:flex sm:items-start">
									<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
										<h3 class="text-lg font-medium leading-6 text-gray-900" id="modal-title">
											Create new bounty program!
										</h3>
										<div class="mt-2">
											<p class="mb-1">Name</p>
											<input
												type="text"
												required
												class="py-2 px-3 focus:outline-none border border-gray-400 rounded-lg"
												placeholder="Name of the bounty program."
												bind:value={$newBountyValue.name}
												name="name"
												on:change={() => handleChange('name')}
											/>
											<p class="text-xs text-red-500 ml-1  absolute">{nameField}</p>
											<br />
											<p class="mb-1 mt-6">Description</p>
											<textarea
												form="newBountyForm"
												required
												class="py-2 px-3 focus:outline-none border border-gray-400 rounded-lg resize-none md:w-auto w-full"
												placeholder="Description of the bounty program."
												rows="15"
												cols="42"
												name="description"
												bind:value={$newBountyValue.description}
												on:change={() => handleChange('desc')}
											/>
											<p class="text-xs text-red-500 ml-1 absolute">{descField}</p>
											<input
												type="file"
												required
												bind:value={$newBountyValue.image}
												class="mt-6"
												name="image"
											/>
										</div>
									</div>
								</div>
							</div>
							<div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
								<button
									type="submit"
									class="inline-flex w-full cursor-pointer justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
									>Create new bounty program!</button
								>
							</div>
						</form>
					{:else}
						<form
							method="POST"
							id="editBountyForm"
							action="?/program"
							enctype="multipart/form-data"
							on:submit|preventDefault={handleSubmit}
						>
							<div class="bg-white px-10 md:px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<div class="right-5 top-3 absolute">
									<i
										class="material-icons text-red-500 cursor-pointer"
										on:click={() => {
											isShowing.set(false);
										}}>close</i
									>
								</div>
								<div class="sm:flex sm:items-start">
									<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
										<h3 class="text-lg font-medium leading-6 text-gray-900" id="modal-title">
											Modify the bounty program
										</h3>
										<div class="mt-2">
											<p class="mb-1">Name</p>
											<input
												type="text"
												required
												class="py-2 px-3 focus:outline-none border border-gray-400 rounded-lg"
												placeholder="Name of the bounty"
												bind:value={$newBountyValue.name}
												name="name"
												on:change={() => handleChange('name')}
											/>
											<p class="text-xs text-red-500 ml-1  absolute">{nameField}</p>
											<br />
											<p class="mb-1 mt-6">Description</p>
											<textarea
												form="editBountyForm"
												required
												class="py-2 px-3 focus:outline-none border border-gray-400 rounded-lg resize-none md:w-auto w-full"
												placeholder="Description of the bounty"
												rows="15"
												cols="42"
												name="description"
												bind:value={$newBountyValue.description}
												on:change={() => handleChange('desc')}
											/>
											<p class="text-xs text-red-500 ml-1 absolute">{descField}</p>
											<input
												type="file"
												required
												bind:value={$newBountyValue.image}
												class="mt-6"
												name="image"
											/>
										</div>
									</div>
								</div>
							</div>
							<div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
								<button
									type="submit"
									class="inline-flex w-full cursor-pointer justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
									>Modify bounty!</button
								>
							</div>
						</form>
					{/if}
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.bgCover {
		background-color: rgba(0, 0, 0, 0.7);
	}
</style>
