---
title: Test & Mocks
by: Andreas Fuller 
---

### Galt Eller
## Genialt

# Test & mocks
<!-- .element: class="fragment" -->

---

## Mål
Gøre det nemt at teste Web BFF

_Vi snakker automatiseret tests_
<!-- .element: class="fragment" -->

---

## Automatiseret tests
### Eksempel

```c#
public class MyController(Identity.Employeee employee)
{

  [HttpGet]
  [Route("greet")]
  public ActionResult<string> Greet([FromQuery] name) =>
    name is null
      ? BadRequest()
      : $"Hello {name}. I'am user {employee.Id}";
}
```
<!-- .element: class="fragment" -->

----

## Kan testes end-to-end

```c#
[TestClass]
public class MyControllerTests : TestBase
{
  [TestMethod]
  public async Task ShouldGreet()
  {
    As(new Identity.Employee(42)); // bypass login

    var message = await Client.GetStringAsync("/greet?name=Bo");
    Assert.AreEqual("Hello Bo. I'am user 42", message);
  }
}
```
<!-- .element: class="fragment" -->

Kører mod (dev) api'erne
<!-- .element: class="fragment" -->

__#ØV__
<!-- .element: class="fragment" -->

----
## Kan testes som unit
```c#
[TestClass]
public class MyControllerTests
{
  private MyController _ctlr = new (new Identity.Employee(42));

  [TestMethod]
  public async Task ShouldGreet()
  {
    var message = _ctrl.Greet("Bo");
    Assert.AreEqual("Hello Bo. I'am user 42", message.Value);
  }
}
```
<!-- .element: class="fragment" -->

Kører isoleret.
<!-- .element: class="fragment" -->

---
## Afhængigheder?
- Gem implementationen bag et interface <!-- .element: class="fragment" -->
- Mock afhængigheden <!-- .element: class="fragment" -->

---
## Mocking

```c#
public class MyController(IApiClient client) 
{
  [HttpGet]
  [Route("greet")]
  public Task<ActionResult<string>> Greet([FromQuery] name)
  {
    try {
      var response = await client.Greet(name);
      return response.Message;
    } catch (ApiExecption<ProblemDetails> e) {
      return BadRequest(); // simplified
    }
  }
}
```
<!-- .element: class="fragment" -->
Ikke nemt!
<!-- .element: class="fragment" -->

----
## Test

```c#
[TestClass]
public class MyControllerTests {
  private Mock<IApiClient> _client = new();
  private MyController _ctrl = new (_client.Object); // invalid c#

  [TestMethod]
  public async Task ShouldGreet() {
    _client
      .Setup(x => x.Greet("Bo"))
      .ReturnsAsync(new ApiResponse { Message = "Hello" });

    var result = await _ctrl.Greet("Bo");
    Assert.AreEqual("Hello", result.Value);
  }
}
```
<!-- .element: class="fragment" -->

----
## Er det værd at teste?

- Ja! <!-- .element: class="fragment" -->
- Spørgsmålet er: hvad er værd at teste? <!-- .element: class="fragment" -->
- Komposition giver sjældent mening at teste <!-- .element: class="fragment" -->
- Hvad med mapping? <!-- .element: class="fragment" -->
- Exception håndtering? <!-- .element: class="fragment" -->
- Forretningslogik? <!-- .element: class="fragment" -->
- Vær kritisk, men pragmatisk <!-- .element: class="fragment" -->

---
## Case 1
### [Patch](https://github.com/AutoIT-DK/AutoDesktop-Web/tree/c81669fa161fe0802280d31327ee5e060b92d57b/AutoDesktop.BFF.UnitTest/Helpers/Patch/Vehicle)

----

## Case 2
### [Køretøjslisten](https://github.com/AutoIT-DK/AutoDesktop-Web/blob/c81669fa161fe0802280d31327ee5e060b92d57b/AutoDesktop.BFF/Controllers/Vehicle/VehicleQueryController.cs#L174)

LIVE DEMO
<!-- .element: class="fragment" -->

---

## Konklussion
- Mapping kan lægges i mappers (evt static) <!-- .element: class="fragment" -->
- Brug compileren (f.eks. required) <!-- .element: class="fragment" -->
- Udfaktoriser kompliceret logik <!-- .element: class="fragment" -->
- Vær kritisk, men pragmatisk <!-- .element: class="fragment" -->
- Behov for mocks, kan være tegn på for meget ansvar i samme unit <!-- .element: class="fragment" -->