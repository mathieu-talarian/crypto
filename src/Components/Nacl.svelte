<script lang="ts">
  import { getContext, onMount } from "svelte";

  import { Nacl } from "algo/nacl";
  import { tenMB } from "files/10MB";
  import { oneMB } from "files/1MB";
  import { fiveMB } from "files/5MB";
  import type { Idb } from "store";
  import { toByteArray, toHexString } from "utils";

  const name = `nacl`;

  let nacl: Nacl;

  let idb: Idb;
  let oneEncrypted;
  let fiveEncrypted;
  let tenEncrypted;

  idb = getContext("idb");

  onMount(async () => {
    oneEncrypted = (await idb.getVal(`${name}/oneEncrypted`))
      ? await idb.getVal(`${name}/oneEncrypted`)
      : undefined;
    fiveEncrypted = (await idb.getVal(`${name}/fiveEncrypted`))
      ? JSON.parse(await idb.getVal(`${name}/fiveEncrypted`))
      : undefined;
    tenEncrypted = (await idb.getVal(`${name}/tenEncrypted`))
      ? JSON.parse(await idb.getVal(`${name}/tenEncrypted`))
      : undefined;
  });

  $: nacl = new Nacl();

  const encodeOneMB = async () => {
    const encrypted = await nacl.encrypt(JSON.stringify(oneMB));

    oneEncrypted = toHexString(encrypted);
    await idb.setVal(`${name}/oneEncrypted`, oneEncrypted);
  };

  const decodeOneMB = async () => {
    if (!oneEncrypted) return;

    const encoded = toByteArray(oneEncrypted);

    const decrypted = await nacl.decrypt(encoded);
    if (decrypted === JSON.stringify(oneMB)) {
      console.log("1M decryption success");
    }
  };

  const decodeFiveMB = async () => {
    if (!fiveEncrypted) return;
    const decrypted = await nacl.decrypt(fiveEncrypted);

    if (decrypted === JSON.stringify(fiveMB)) {
      console.log("Five decryption success");
    }
  };

  const encodeFiveMB = async () => {
    fiveEncrypted = await nacl.encrypt(JSON.stringify(fiveMB));
    await idb.setVal(`${name}/fiveEncrypted`, JSON.stringify(fiveEncrypted));
  };

  const encodeTenMB = async () => {
    tenEncrypted = await nacl.encrypt(JSON.stringify(tenMB));
    await idb.setVal(`${name}/tenEncrypted`, JSON.stringify(tenEncrypted));
  };

  const decodeTenMB = async () => {
    if (!tenEncrypted) return;
    const decrypted = await nacl.decrypt(tenEncrypted);

    if (decrypted === JSON.stringify(tenMB)) {
      console.log("Ten decryption success");
    }
  };
</script>

<header class="bg-white shadow">
  <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
    <h1 class="text-3xl font-bold text-gray-900">NACL</h1>
  </div>
</header>
<main>
  <div class="flex flex-col justify-center">
    <div class="flex flex-row align-middle justify-center">
      <button
        on:click={encodeOneMB}
        class="text-gray-300 bg-gray-700 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
        >Encrypt 1MB
      </button>
      {#if oneEncrypted}
        <button
          on:click={decodeOneMB}
          class="text-gray-300 bg-gray-700 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >Decrypt 1MB
        </button>
      {/if}
    </div>

    <div class="flex flex-row align-middle justify-center">
      <button
        on:click={encodeFiveMB}
        class="text-gray-300 bg-gray-700 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
        >Encrypt 5MB
      </button>
      {#if fiveEncrypted}
        <button
          on:click={decodeFiveMB}
          class="text-gray-300 bg-gray-700 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >Decrypt 5MB
        </button>
      {/if}
    </div>

    <div class="flex flex-row align-middle justify-center">
      <button
        on:click={encodeTenMB}
        class="text-gray-300 bg-gray-700 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
        >Encrypt 10MB
      </button>
      {#if tenEncrypted}
        <button
          on:click={decodeTenMB}
          class="text-gray-300 bg-gray-700 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          >Decrypt 10MB
        </button>
      {/if}
    </div>
  </div>
</main>
