## 2026-02-06 - Core Engine and Component Optimizations

**Learning:** Replacing `Array.prototype.filter()` with an in-place write-pointer algorithm in the main game loop significantly reduces garbage collection pressure by avoiding per-frame array allocations. Additionally, `THREE.Box3.setFromObject()` is a computationally expensive operation as it recursively traverses the entire object hierarchy and all geometry vertices. It should never be used in a hot loop (like `update`). Caching the result or computing a pivot offset once is much more efficient.

**Action:** Always prefer in-place array modifications for frequent cleanup tasks. Cache references and pre-calculate bounding box data (like heights and offsets) during initialization or lazily, rather than re-calculating them every frame.
