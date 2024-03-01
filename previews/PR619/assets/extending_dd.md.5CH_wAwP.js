import{_ as k,E as h,c as n,J as e,w as a,V as d,o as r,m as i,a as s}from"./chunks/framework.sXDJgbE6.js";const I=JSON.parse('{"title":"Extending DimensionalData","description":"","frontmatter":{},"headers":[],"relativePath":"extending_dd.md","filePath":"extending_dd.md","lastUpdated":null}'),p={name:"extending_dd.md"},o=d('<h1 id="Extending-DimensionalData" tabindex="-1">Extending DimensionalData <a class="header-anchor" href="#Extending-DimensionalData" aria-label="Permalink to &quot;Extending DimensionalData {#Extending-DimensionalData}&quot;">​</a></h1><p>Nearly everything in DimensionalData.jl is designed to be extensible.</p><ul><li><p><code>AbstractDimArray</code> are easily extended to custom array types. <code>Raster</code> or <code>YAXArray</code> are examples from other packages.</p></li><li><p><code>AbstractDimStack</code> are easily extended to custom mixed array dataset. <code>RasterStack</code> or <code>ArViZ.Dataset</code> are examples.</p></li><li><p><code>Lookup</code> can have new types added, e.g. to <code>AbstractSampled</code> or <code>AbstractCategorical</code>. <code>Rasters.Projected</code> is a lookup that knows its coordinate reference system, but otherwise behaves as a regular <code>Sampled</code> lookup.</p></li></ul><p><code>dims</code>, <code>rebuild</code> and <code>format</code> are the key interface methods in most of these cases.</p><h2 id="dims" tabindex="-1"><code>dims</code> <a class="header-anchor" href="#dims" aria-label="Permalink to &quot;`dims` {#dims}&quot;">​</a></h2><p>Objects extending DimensionalData.jl that have dimensions must return a <code>Tuple</code> of constructed <code>Dimension</code>s from <code>dims(obj)</code>.</p><h3 id="Dimension-axes" tabindex="-1"><code>Dimension</code> axes <a class="header-anchor" href="#Dimension-axes" aria-label="Permalink to &quot;`Dimension` axes {#Dimension-axes}&quot;">​</a></h3><p>Dimensions return from <code>dims</code> should hold a <code>Lookup</code> or in some cases just an <code>AbstractArray</code> (like wiht <code>DimIndices</code>). When attached to mullti-dimensional objects, lookups must be the <em>same length</em> as the axis of the array it represents, and <code>eachindex(A, i)</code> and <code>eachindex(dim)</code> must return the same values.</p><p>This means that if the array has OffsetArrays.jl axes, the array the dimension wraps must also have OffsetArrays.jl axes.</p><h3 id="dims-keywords" tabindex="-1"><code>dims</code> keywords <a class="header-anchor" href="#dims-keywords" aria-label="Permalink to &quot;`dims` keywords {#dims-keywords}&quot;">​</a></h3><p>To any <code>dims</code> keyword argument that usually requires the dimension I, objects should accept any <code>Dimension</code>, <code>Type{&lt;:Dimension}</code>, <code>Symbol</code>, <code>Val{:Symbol}</code>, <code>Val{&lt;:Type{&lt;:Dimension}}</code> or also regular <code>Integer</code>.</p><p>This is easier than it sounds, calling <code>DD.dims(objs, dims)</code> will return the matching dimension and <code>DD.dimnum(obj, dims)</code> will return the matching <code>Int</code> for any of these inputs as long as <code>dims(obj)</code> is implemented.</p><h2 id="rebuild" tabindex="-1"><code>rebuild</code> <a class="header-anchor" href="#rebuild" aria-label="Permalink to &quot;`rebuild` {#rebuild}&quot;">​</a></h2><p>Rebuild methods are used to rebuild immutable objects with new field values, in a way that is more flexible and extensible than just using ConstructionBase.jl reconstruction. Developers can choose to ignore some of the fields passed by <code>rebuild</code>.</p><p>The function signature is always one of:</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">rebuild</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(obj, args</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">...</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span>\n<span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">rebuild</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(obj; kw</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583;">...</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">)</span></span></code></pre></div><p><code>rebuild</code> has keyword versions automatically generated for all objects using <a href="https://github.com/JuliaObjects/ConstructionBase.jl" target="_blank" rel="noreferrer">ConstructionBase.jl</a>.</p><p>These will work without further work as long as your object has the fields used by DimensionalData.jl objects. For example, <code>AbstractDimArray</code> will receive these keywords in <code>rebuild</code>: <code>data</code>, <code>dims</code>, <code>refdims</code>, <code>name</code>, <code>metadata</code>.</p><p>If your <code>AbstractDimArray</code> does not have all these fields, you must implement <code>rebuild(x::YourDimArray; kw...)</code> manually.</p><p>An argument method is also defined with the same arguments as the keyword version. For <code>AbstractDimArray</code> it should only be used for updating <code>data</code> and <code>dims</code>, any more that that is confusing.</p><p>For <code>Dimension</code> and <code>Selector</code> the single argument versions are easiest to use, as there is only one argument.</p><h2 id="format" tabindex="-1"><code>format</code> <a class="header-anchor" href="#format" aria-label="Permalink to &quot;`format` {#format}&quot;">​</a></h2><p>When constructing an <code>AbstractDimArray</code> or <code>AbstractDimStack</code> <a href="/DimensionalData.jl/previews/PR619/api/dimensions#DimensionalData.Dimensions.format"><code>DimensionalData.format</code></a> must be called on the <code>dims</code> tuple and the parent array:</p><div class="language-julia vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">julia</span><pre class="shiki shiki-themes github-light github-dark vp-code"><code><span class="line"><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF;">format</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">(dims, array)</span></span></code></pre></div><p>This lets DimensionalData detect the lookup properties, fill in missing fields of a <code>Lookup</code>, pass keywords from <code>Dimension</code> to detected <code>Lookup</code> constructors, and accept a wider range of dimension inputs like tuples of <code>Symbol</code> and <code>Type</code>.</p><p>Not calling <code>format</code> in the outer constructors of an <code>AbstractDimArray</code> has undefined behaviour.</p><h2 id="Interfaces.jl-interterface-testing" tabindex="-1">Interfaces.jl interterface testing <a class="header-anchor" href="#Interfaces.jl-interterface-testing" aria-label="Permalink to &quot;Interfaces.jl interterface testing {#Interfaces.jl-interterface-testing}&quot;">​</a></h2><p>DimensionalData defines explicit, testable Interfaces.jl interfaces: <code>DimArrayInterface</code> and <code>DimStackInterface</code>.</p>',28),g=i("p",null,[s("This is the implementation definition for "),i("code",null,"DimArray"),s(":")],-1),y=i("div",{class:"language-julia vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"julia"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[i("code",null,[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"julia"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},">"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}}," using"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," DimensionalData, Interfaces")]),s(`
`),i("span",{class:"line"}),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"julia"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},">"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," @implements"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," DimensionalData"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"."),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"DimArrayInterface{("),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},":refdims"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},","),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},":name"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},","),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},":metadata"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},")} DimArray ["),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"rand"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"X"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"10"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"), "),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"Y"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"10"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},")), "),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"zeros"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"Z"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"10"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"))]")])])])],-1),c=i("p",null,[s("See the "),i("a",{href:"/DimensionalData.jl/previews/PR619/api/reference#DimensionalData.DimArrayInterface"},[i("code",null,"DimensionalData.DimArrayInterface")]),s(" docs for options. We can test it with:")],-1),u=i("div",{class:"language-julia vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"julia"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[i("code",null,[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"julia"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},">"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," Interfaces"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"."),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"test"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"(DimensionalData"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"."),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"DimArrayInterface)")])])])],-1),m=i("div",{class:"language- vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"}),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[i("code",null,[i("span",{class:"line"}),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"Testing "),i("span",{style:{"--shiki-light":"#0366d6","--shiki-dark":"#2188ff"}},"DimArrayInterface"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}}," is implemented for "),i("span",{style:{"--shiki-light":"#0366d6","--shiki-dark":"#2188ff"}},"DimArray")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#959da5","--shiki-dark":"#959da5"}},"Mandatory components")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#5a32a3","--shiki-dark":"#b392f0"}},"dims"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},": (defines a `dims` method ["),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"],")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"       dims are updated on getindex ["),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"])")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#5a32a3","--shiki-dark":"#b392f0"}},"refdims_base"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},": `refdims` returns a tuple of Dimension or empty ["),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"]")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#5a32a3","--shiki-dark":"#b392f0"}},"ndims"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},": number of dims matches dimensions of array ["),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"]")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#5a32a3","--shiki-dark":"#b392f0"}},"size"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},": length of dims matches dimensions of array ["),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"]")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#5a32a3","--shiki-dark":"#b392f0"}},"rebuild_parent"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},": rebuild parent from args ["),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"]")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#5a32a3","--shiki-dark":"#b392f0"}},"rebuild_dims"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},": rebuild paaarnet and dims from args ["),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"]")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#5a32a3","--shiki-dark":"#b392f0"}},"rebuild_parent_kw"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},": rebuild parent from args ["),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"]")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#5a32a3","--shiki-dark":"#b392f0"}},"rebuild_dims_kw"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},": rebuild dims from args ["),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"]")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#5a32a3","--shiki-dark":"#b392f0"}},"rebuild"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},": all rebuild arguments and keywords are accepted ["),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"]")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#959da5","--shiki-dark":"#959da5"}},"Optional components")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#5a32a3","--shiki-dark":"#b392f0"}},"refdims"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},": (refdims are updated in args rebuild ["),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"],")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"          refdims are updated in kw rebuild ["),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"],")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"          dropped dimensions are added to refdims ["),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"])")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#5a32a3","--shiki-dark":"#b392f0"}},"name"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},": (rebuild updates name in arg rebuild ["),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"],")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"       rebuild updates name in kw rebuild ["),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"])")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#5a32a3","--shiki-dark":"#b392f0"}},"metadata"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},": (rebuild updates metadata in arg rebuild ["),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"],")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"           rebuild updates metadata in kw rebuild ["),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"])")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"true")])])])],-1),E=i("p",null,[s("The implementation definition for "),i("code",null,"DimStack"),s(":")],-1),f=i("div",{class:"language-julia vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"julia"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[i("code",null,[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"julia"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},">"),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}}," @implements"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," DimensionalData"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"."),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"DimStackInterface{("),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},":refdims"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},","),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},":metadata"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},")} DimStack ["),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"DimStack"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"zeros"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"Z"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"10"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"))), "),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"DimStack"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"rand"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"X"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"10"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"), "),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"Y"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"10"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"))), "),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"DimStack"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"rand"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"X"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"10"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"), "),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"Y"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"10"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},")), "),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"rand"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"X"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"("),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"10"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},")))]")])])])],-1),b=i("p",null,[s("See the "),i("a",{href:"/DimensionalData.jl/previews/PR619/api/reference#DimensionalData.DimStackInterface"},[i("code",null,"DimensionalData.DimStackInterface")]),s(" docs for options. We can test it with:")],-1),D=i("div",{class:"language-julia vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"},"julia"),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[i("code",null,[i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"julia"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},">"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}}," Interfaces"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"."),i("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"test"),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"(DimensionalData"),i("span",{style:{"--shiki-light":"#D73A49","--shiki-dark":"#F97583"}},"."),i("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"DimStackInterface)")])])])],-1),C=i("div",{class:"language- vp-adaptive-theme"},[i("button",{title:"Copy Code",class:"copy"}),i("span",{class:"lang"}),i("pre",{class:"shiki shiki-themes github-light github-dark vp-code"},[i("code",null,[i("span",{class:"line"}),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"Testing "),i("span",{style:{"--shiki-light":"#0366d6","--shiki-dark":"#2188ff"}},"DimStackInterface"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}}," is implemented for "),i("span",{style:{"--shiki-light":"#0366d6","--shiki-dark":"#2188ff"}},"DimStack")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#959da5","--shiki-dark":"#959da5"}},"Mandatory components")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#5a32a3","--shiki-dark":"#b392f0"}},"dims"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},": (defines a `dims` method ["),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"],")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"       dims are updated on getindex ["),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"])")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#5a32a3","--shiki-dark":"#b392f0"}},"refdims_base"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},": `refdims` returns a tuple of Dimension or empty ["),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"]")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#5a32a3","--shiki-dark":"#b392f0"}},"ndims"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},": number of dims matches dimensions of array ["),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"]")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#5a32a3","--shiki-dark":"#b392f0"}},"size"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},": length of dims matches dimensions of array ["),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"]")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#5a32a3","--shiki-dark":"#b392f0"}},"rebuild_parent"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},": rebuild parent from args ["),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"]")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#5a32a3","--shiki-dark":"#b392f0"}},"rebuild_dims"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},": rebuild paaarnet and dims from args ["),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"]")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#5a32a3","--shiki-dark":"#b392f0"}},"rebuild_layerdims"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},": rebuild paaarnet and dims from args ["),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"]")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#5a32a3","--shiki-dark":"#b392f0"}},"rebuild_dims_kw"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},": rebuild dims from args ["),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"]")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#5a32a3","--shiki-dark":"#b392f0"}},"rebuild_parent_kw"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},": rebuild parent from args ["),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"]")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#5a32a3","--shiki-dark":"#b392f0"}},"rebuild_layerdims_kw"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},": rebuild parent from args ["),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"]")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#5a32a3","--shiki-dark":"#b392f0"}},"rebuild"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},": all rebuild arguments and keywords are accepted ["),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"]")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#959da5","--shiki-dark":"#959da5"}},"Optional components")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#5a32a3","--shiki-dark":"#b392f0"}},"refdims"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},": (refdims are updated in args rebuild ["),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"],")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"          refdims are updated in kw rebuild ["),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"],")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"          dropped dimensions are added to refdims ["),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"])")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#5a32a3","--shiki-dark":"#b392f0"}},"metadata"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},": (rebuild updates metadata in arg rebuild ["),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"],")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"           rebuild updates metadata in kw rebuild ["),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},", "),i("span",{style:{"--shiki-light":"#28a745","--shiki-dark":"#34d058"}},"true"),i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"])")]),s(`
`),i("span",{class:"line"},[i("span",{style:{"--shiki-light":"#24292e","--shiki-dark":"#e1e4e8"}},"true")])])])],-1);function F(_,v,A,j,w,x){const t=h("PluginTabsTab"),l=h("PluginTabs");return r(),n("div",null,[o,e(l,null,{default:a(()=>[e(t,{label:"array"},{default:a(()=>[g,y,c,u,m]),_:1}),e(t,{label:"stack"},{default:a(()=>[E,f,b,D,C]),_:1})]),_:1})])}const S=k(p,[["render",F]]);export{I as __pageData,S as default};
