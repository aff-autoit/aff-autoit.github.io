---
title: Immutability
by: Andreas Fuller 
status: draft
---

### Galt eller
## Genialt

# Immutability <!-- .element: class="fragment" -->

---
## Et request


<div class='r-stack'>

```c#
public class AddCustomerRequest
{
  public string Name { get; set; } = string.Empty;
  public List<string> Interests { get; set; } = new ();
}
```
<!-- .element: class="current-visible" -->

```c#
public class AddCustomerRequest
{
  public string Name { get; init; } = string.Empty;
  public List<string> Interests { get; init; } = new ();
}
```
<!-- .element: class="fragment current-visible" -->

```c#
public class AddCustomerRequest
{
  public string Name { get; init; } = string.Empty;
  public IReadOnlyList<string> Interests { get; init; }
    = Array.Empty<string>();
}
```
<!-- .element: class="fragment current-visible" -->


```c#
public record AddCustomerRequest(
  string Name,
  IReadOnlyList<string> Interests
);
```
<!-- .element: class="fragment" -->

</div>


---

## Kan også bruges til

- Responses <!-- .element: class="fragment" -->
- Commands <!-- .element: class="fragment" -->
- Queries <!-- .element: class="fragment" -->
- Helt generelt DTO'er <!-- .element: class="fragment" -->
- Metoder? <!-- .element: class="fragment" -->


---

## Metoder

<div class='r-stack'>

```c#
public interface ICompanyService {
  List<Comany> GetCompanies(List<int> ids);
}
```
<!-- .element: class="current-visible" -->

```c#
public interface ICompanyService {
  List<Comany> GetCompanies(IReadOnlyList<int> ids);
}
```
<!-- .element: class="fragment current-visible" -->

```c#
public interface ICompanyService {
  IReadOnlyList<Comany> GetCompanies(IReadOnlyList<int> ids);
}
```
<!-- .element: class="fragment" -->

</div>

---

##