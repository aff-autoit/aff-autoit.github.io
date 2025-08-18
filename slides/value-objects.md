---
title: Value Objects
---

### Galt eller
## Genialt
# Value Objects <!-- .element: class="fragment" -->


---

## Hvad er Value Objects
Formaliseret i Domain-Driven Design:
<!-- .element: class="fragment" -->

> Many objects have no conceptual identity. These objecs describe some characteristic of a thing.
>
> -- <cite>Eric Evans</cite>
<!-- .element: class="fragment" -->

Teknisk:
<!-- .element: class="fragment" -->

> Objects that are equal due to the value of their properties [...], are called value objects.
>
> [...] value objects should be immutable.
>
> -- <cite>Martin Fowler</cite>
<!-- .element: class="fragment" -->


----

## Eksempler

* Navn  <!-- .element: class="fragment" -->
* Emailadresse <!-- .element: class="fragment" -->
* Telefonnummer <!-- .element: class="fragment" -->
* Beløb <!-- .element: class="fragment" -->
* Afstand <!-- .element: class="fragment" -->
* Hastighed <!-- .element: class="fragment" -->
* VehicleId <!-- .element: class="fragment" -->

----

## Pros v Cons

* ✅ Tydelig forventningsafstemning <!-- .element: class="fragment" -->
* ✅ Tidlig validering <!-- .element: class="fragment" -->
* ✅ Løser "Primitive Obsession" <!-- .element: class="fragment" -->
* ✅ Object equality <!-- .element: class="fragment" -->
* ❌ Kompleksitet <!-- .element: class="fragment" -->

----

## Pros

```c#
public void SetEmailAddress(string email)
{
  if (!EmailValidator.Validate(email))
    throw new Exception("Not a valid email");
  _email = email;
}
```
<!-- .element: class="fragment" -->

### vs

```c#
public void SetEmailAddress(EmailAddress email)
{
  _email = email;
}
```
<!-- .element: class="fragment" -->

----

## Pros

```c#
  // Tidlig validering
  var email = new EmailAddress("aff@autoit.dk");

  // Tydelig forventningsafstemning
  company.SetEmailAddress(email);
```

----

### Cons
## Kompleksitet

* Hvad et value object kodeteknisk? <!-- .element: class="fragment" --> 
* Hvordan persisteres et value object? <!-- .element: class="fragment" --> 
* Hvordan transporteres et value object? <!-- .element: class="fragment" --> 
* Hvordan kommunikeres et value object? <!-- .element: class="fragment" --> 
* Og sikkert mere... <!-- .element: class="fragment" --> 

---

## Hvad et value object?
### kodeteknisk

## Vi bruger records <!-- .element: class="fragment" -->

```c#
public record EmailAddress
{ 
  public EmailAddress(string value)
  {
    if (!value.Contains('@'))
      throw new Exception($"{value} is not a valid email address");
    Value = value;
  }

  public string Value { get; }
}
```
<!-- .element: class="fragment" -->

_Result og factory udeladt her_  <!-- .element: class="fragment" -->

----
## Hvad et value object?
### lidt mere kød på


```c#
public enum Unit { Meter, Kilometer }

public record Distance { 
  public Distance(decimal amount, Unit unit)
  {
    if (amount < 0) throw new Exception("...");
    Amount = amount;
    Unit = unit;
  }

  public decimal Amount { get; }
  public Unit Unit { get; }
}
```
<!-- .element: class="fragment" -->

_Equals bør overskrives så 1km = 1000m_  <!-- .element: class="fragment" -->

---
## Persistering
### EF Core <!-- .element: class="fragment" -->

EF core tillader konvertering af typer ved at bruge _ValueConverters_
<!-- .element: class="fragment" -->

```c#
public class EmailConverter() : ValueConverter<Email, string>(
  email => email.Value,
  str => new Email(str)  
);
```
<!-- .element: class="fragment" -->

----

## Persistering
### EF Core

Kan bruges i konfigurationen af en entitet

```c#
public class MyContext : DbContext {
  protected override void OnModelCreating(ModelBuilder builder) {
    builder.Entity<User>(user => {
      user.HasTable("users");
      // etc

      user
        .Property(user => user.Email)
        .HasConversion<EmailConverter>();
    });
  }
}

```
<!-- .element: class="fragment" -->

----

## Persistering
### EF Core

Eller på en hel _DbContext_

```c#
public class MyContext : DbContext {
  protected override void ConfigureConventions(
    ModelConfigurationBuilder builder
  )
  {
    builder
      .Properties<Email>()
      .HaveConversion<EmailConverter>();
  }
}
```
<!-- .element: class="fragment" -->

----


## Persistering
### EF Core

`.ComplexProperty` kan bruges til Value Objects med flere properties der skal mappes til hver deres kolonne.

```c#
public class MyContext : DbContext {
  protected override void OnModelCreating(ModelBuilder builder) {
    builder.Entity<Vehicle>(vehicle => {
      vehicle.HasTable("vehicles");
      // etc

      vehicle
        .ComplexProperty(vehicle => vehicle.Price);
    });
  }
}
```
<!-- .element: class="fragment" -->

---

## Transport
### System.Text.Json

System.Text.Json serializerer nemt records, men deserializeringen kræver en public constructor, og hvis man bruger `Factory Pattern` vil den være private og dermed fejle.
<!-- .element: class="fragment" -->
Derudover vil mange value objects (f.eks. Email) med fordel kunne serializeres til strenge eller andre simple typer.
<!-- .element: class="fragment" -->
For at System.Text.Json giver en pæn fejl, skal der kastes en JsonException. Den vil vi nødig kaste fra vores Value Object.
<!-- .element: class="fragment" -->
System.Text.Json tilbyder JsonConverters som kan løse disse problemer
<!-- .element: class="fragment" -->


----
## Transport

En simpel converter:
```c#
public class EmailAddressConverter : JsonConverter<EmailAddress> {
    public override void Write(Utf8JsonWriter writer, EmailAddress emailAddress, JsonSerializerOptions options) {
        writer.WriteStringValue(emailAddress.Value);
    }

    public override EmailAddress Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options) {
        var value = reader.GetString() ?? throw new JsonException("Expected a string");
        try {
          return new EmailAddress(value);
        } catch (Exception e) {
            throw new JsonException("Bad email address", e);
        }
    }
}
```
<!-- .element: class="fragment" -->

----

## Transport

Converters skal registeres både for api'et

```c#
services
  .AddControllersWithViews()
  .AddJsonOptions(x => x.JsonSerializerOptions.Converters.Add(
      new EmailAddressConverter()
  ));

```
<!-- .element: class="fragment" -->

og i klienten:

```
public partial class MyClient
{
  partial void UpdateJsonSerializerSettings(JsonSerializerOptions settings)
  {
    settings.Converters.Add(new EmailAddressConverter());
  }
}
```
<!-- .element: class="fragment" -->

----
## Transport

Derudover skal klienten have adgang til den samme CLR type som converteren arbejder på, så typen skal deles med klienten
```xml
/// NSwagClientMyService.csproj
<ProjectReference Include="MyService.Abstractions.csproj" />
```
<!-- .element: class="fragment" -->

og ignoreres i kodegeneringen (NSwag):

```json
/// MyService.nswag
{
  "codeGenerators": {
    "openApiToCSharpClient": {
      "excludedTypeNames": ["EmailAddress"]
    }
  }
}
```
<!-- .element: class="fragment" -->

----
## Transport
### System.Text.Json

Hvis en klient sender noget efter api'et der ikke er et gyldigt value object, vil api'et svarer noget i stil med:
```json
{
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "$.email": [
      "Email address is invalid."
    ]
  },
}
```
<!-- .element: class="fragment" -->


---

## Kommunikation
### OpenAPI

Når swagger genererer skemaet for et value object, vil den kigge på CLR typen.  
Hvis et value object ikke serializeres til noget der matcher CLR typen (f.eks. string) skal det fixes med et schema filter:
<!-- .element: class="fragment" -->

```c#
public class EmailAddressSchemaFilter : ISchemaFilter {
  public void Apply(OpenApiSchema schema, SchemaFilterContext ctx) {
    if (ctx.Type == typeof(EmailAddress)) {
        schema.Properties.Clear();
        schema.Example = "noreply@example.com";
        schema.Title = "EmailAddress";
    }
  }
}
```
<!-- .element: class="fragment" -->
Det vil lave en openapi spec hvor Email står som et tomt object, men dog med et eksempel der fortæller det reelt er en string
<!-- .element: class="fragment" -->

---

## For komplekst?

Det hele virker meget komplekst, men bør være et one-time setup pr value object og giver forhåbentlig færre bugs og mere klarhed i de enkelte domæner.
<!-- .element: class="fragment" -->

Vi starter med et par Value Objecter (EmailAddress, PhoneNumber, Url og CvrNumber) der er så generiske at de tåler at blive delt via SharedKernel.ValueObjects.
<!-- .element: class="fragment" -->

Vi har lagt konfigurationer én gang for alle op i denne delte pakke - så konfigurationen vil i første omgang være én gang pr api/dbcontext.
<!-- .element: class="fragment" -->

Vi holder transportlaget i gateways/bff'er ude i første omgang (og måske forevigt), da vi ikke vil pålægge eksterne og frontends at bruge value objects.
<!-- .element: class="fragment" -->
