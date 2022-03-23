<script lang="ts">
  import { setContext } from "svelte";
  import { Link, Route, Router } from "svelte-navigator";

  import { Idb } from "store";

  import Nacl from "./Nacl.svelte";
  import OpenPgp from "./OpenPGP.svelte";

  const idb = new Idb();

  setContext("idb", idb);
</script>

<Router>
  <div>
    <nav class="bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <span class="text-white">Crypto Bench</span>
            </div>
            <div class="md:block">
              <div class="ml-10 flex items-baseline space-x-4">
                <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
                <Link
                  to="/"
                  class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  aria-current="page">NACL</Link
                >

                <a
                  href="/pgp"
                  class="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >PGP</a
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <Route path="/"><Nacl /></Route>
    <Route path="/pgp"><OpenPgp /></Route>
  </div>
</Router>
