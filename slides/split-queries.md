---
title: Split Queries
subTitle: Entity Framework
by: Andreas Fuller 
---

### Galt Eller
## Genialt

# Split queries 
<!-- .element: class="fragment" -->
#### Entity Framework
<!-- .element: class="fragment" -->


---
Standard queries
```c#
return ctx.VehicleAggregated
  .Include(v => v.Images)
  .ToListAsync()
```

⇓

```sql
SELECT v.*, Id.id -- only id is selected for images
FROM VehicleAggregated v
INNER JOIN Images i ON i.VehicleId = v.id
```
<!-- .element: class="fragment" -->

_6.700.528 rækker á ~1kb_<!-- .element: class="fragment" -->

_~6.7gb data_  <!-- .element: class="fragment" -->

----
### Split query


```c#
return ctx.VehicleAggregated
  .AsSplitQuery()
  .Include(v => v.Images)
  .ToListAsync()
```

⇓

```sql
SELECT v.* FROM VehicleAggregated v

-- followed by
SELECT i.VehicleId, i.Id
FROM VehicleAggregated v
INNER JOIN Images i ON i.VehicleId = v.id
```
<!-- .element: class="fragment" -->

_4.227.783 rækker á ~1kb + 2.634.31 5 rækker á 12b_
<!-- .element: class="fragment" -->

_4,2 gb + 31mb = 4.2gb_
<!-- .element: class="fragment" -->

---
### Silverbullet?

<ul>
  <li class='fragment'>Hvis hovedtabellen er lille, er besparelsen også lille</li>
  <li class='fragment'>En <i>Data Loader</i> kan være hurtigere, men også mere kompleks</li>
  <li class='fragment'>Data shapping kan være en bedre start</li>
  <li class='fragment'>Kræver <code>Expression&lt;Func&lt;T, U&gt;&gt;</code></li>
</ul>


----
## Expression?

```c#
IdResponse Map(VehicleAggregated vehicle) =>
  new IdResponse
  {
    id: vehicle.Id
  };

public List<IdReponse> GetAllIds() {
  return _vehicleContext
    .VehicleAggregated
    .Select(v => Map(v))
    .ToList();
}

/// SQL: SELECT * FROM VehicleAggregated
```

----
## Expression?

```c#
Expression<Func<VehicleAggregated, IdResponse>> Map = (vehicle) =>
  new IdResponse
  {
    id: vehicle.Id
  };

public List<IdReponse> GetAllIds() {
  return _vehicleContext
    .VehicleAggregated
    .Select(v => Map(v))
    .ToList();
}

/// SQL: SELECT id FROM VehicleAggregated
```
