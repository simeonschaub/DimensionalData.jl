import{_ as a,c as t,o as r,V as i}from"./chunks/framework.GNui4pSI.js";const b=JSON.parse('{"title":"DiskArrays.jl compatability {#DiskArrays.jl-compatability}","description":"","frontmatter":{},"headers":[],"relativePath":"diskarrays.md","filePath":"diskarrays.md","lastUpdated":null}'),e={name:"diskarrays.md"},s=i('<h1 id="diskarrays-jl-compatability-diskarrays-jl-compatability" tabindex="-1"><a href="https://github.com/meggart/DiskArrays.jl" target="_blank" rel="noreferrer">DiskArrays.jl</a> compatability {#<a href="https://github.com/meggart/DiskArrays.jl" target="_blank" rel="noreferrer">DiskArrays.jl</a>-compatability} <a class="header-anchor" href="#diskarrays-jl-compatability-diskarrays-jl-compatability" aria-label="Permalink to &quot;[DiskArrays.jl](https://github.com/meggart/DiskArrays.jl) compatability {#[DiskArrays.jl](https://github.com/meggart/DiskArrays.jl)-compatability}&quot;">​</a></h1><p>DiskArrays enables lazy, chunked application of:</p><ul><li><p>broadcast</p></li><li><p>reductions</p></li><li><p>iteration</p></li><li><p>generators</p></li><li><p>zip</p></li></ul><p>It is rarely used directly, but is present in most disk and cloud based spatial data packages in julia, including: ArchGDAL.jl, NetCDF.jl, Zarr.jl, NCDatasets.lj, GRIBDatasets.jl and CommonDataModel.jl</p><p>The combination of DiskArrays.jl and DimensionalData.jl is Julias answer to pythons <a href="https://xarray.dev/" target="_blank" rel="noreferrer">xarray</a>. Rasters.jl and YAXArrays.jl are user-facing tools building on this combination.</p><p>They have no direct dependency relationships, with but are intentionally designed to integrate via both adherence to julias <code>AbstractArray</code> interface, and by coordination during development of both packages.</p>',6),l=[s];function o(n,c,p,d,y,h){return r(),t("div",null,l)}const k=a(e,[["render",o]]);export{b as __pageData,k as default};