<script lang="ts">
  import { signerAddress } from "svelte-ethers-store";
  import { ethers } from "ethers";
  import FormPanel from "../../components/FormPanel.svelte";
  import Input from "../../components/Input.svelte";
  import Button from "../../components/Button.svelte";
  import { tierReport } from "../../utils";
  import { push } from "svelte-spa-router";
  import { init721BalanceTier } from "./erc721-balance-tier";

  export let params;

  let balanceTierContract,
    tierValues,
    errorMsg,
    erc721Contract,
    erc721Name,
    erc721Address,
    erc721Symbol,
    addressToReport,
    parsedReport,
    addressBalance,
    balanceTierAddress;

  $: if (params.wild) {
    initContract();
  }
  const initContract = async () => {
    if (ethers.utils.isAddress(params.wild)) {
      // setting up the balance tier contract
      ({
        balanceTierContract,
        tierValues,
        errorMsg,
        erc721Contract,
        erc721Name,
        erc721Address,
        erc721Symbol,
      } = await init721BalanceTier(params.wild));
    } else if (params.wild) {
      errorMsg = "Not a valid BalanceTier address";
    }
  };

  const report = async () => {
    if (ethers.utils.isAddress(addressToReport)) {
      const report = await balanceTierContract.report(addressToReport);
      parsedReport = tierReport(report);
      addressBalance = await erc721Contract.balanceOf(addressToReport);
    } else {
      errorMsg = "Not a valid Ethereum address";
    }
  };

  const reportMyAddress = () => {
    addressToReport = $signerAddress;
    report();
  };
</script>

<div class="flex w-full max-w-prose flex-col gap-y-4">
  <div class="mb-2 flex flex-col gap-y-2">
    <span class="text-2xl"> Get an ERC721BalanceTier report. </span>
    <span class="text-gray-400">
      ERC721BalanceTier checks the amount of a specific ERC721 held in a wallet.
    </span>
    {#if !params.wild}
      <span class="text-gray-400">
        Enter an ERC721BalanceTier contract address below, or <span
          class="cursor-pointer underline"
          on:click={() => {
            push("/erc721balancetier/list");
          }}>browse all deployed ERC721BalanceTier contracts.</span
        >
      </span>
    {/if}
  </div>
  {#if ethers.utils.isAddress(params.wild) && params.wild && !errorMsg}
    <FormPanel heading="ERC721 used for this BalanceTier">
      <div class="mb-4 flex flex-col gap-y-2">
        <div class="flex flex-col text-gray-400">
          <span>Name: {erc721Name}</span>
          <span>Symbol: {erc721Symbol}</span>
          <span>Address: {erc721Address}</span>
        </div>
      </div>
    </FormPanel>
    <FormPanel heading="Get a report on an address">
      <Input
        bind:value={addressToReport}
        type="text"
        placeholder="Enter an Ethereum address"
      />
      <div class="flex flex-row gap-x-2">
        <Button shrink on:click={report}>Get a report</Button>
        <Button shrink on:click={reportMyAddress}>Report my address</Button>
      </div>
      {#if tierValues}
        <div class="flex flex-col gap-y-2">
          <span class="text-lg">Token values for this BalanceTier:</span>
          {#each tierValues as value, i}
            <span class="text-gray-400">
              Tier {i + 1}: {value.eq(ethers.constants.MaxInt256)
                ? "none"
                : value.toString()}
              {#if parsedReport?.[i] == 0}
                ✅
              {:else if parsedReport?.[i] > 0}
                ❌
              {/if}
            </span>
          {/each}
        </div>
        {#if addressBalance}
          <span
            >Balance for {addressToReport}: {addressBalance.toString()}
            {erc721Symbol}</span
          >
        {/if}
      {/if}
    </FormPanel>
  {:else if errorMsg}
    <span class="text-red-400">{errorMsg}</span>
  {:else if !params.wild}
    <FormPanel>
      <Input
        bind:value={balanceTierAddress}
        type="address"
        placeholder="Contract address"
      />
      <Button
        on:click={() => {
          push(`/erc721balancetier/report/${balanceTierAddress}`);
        }}
      >
        Load
      </Button>
    </FormPanel>
  {/if}
</div>
