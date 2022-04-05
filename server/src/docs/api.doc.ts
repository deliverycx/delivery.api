import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { ProductModule } from "../ioc/product.module";
import { CategoryModule } from "../ioc/category.module";
import { UserModule } from "../ioc/user.module";
import { OrganizationModule } from "../ioc/organization.module";
import { CityModule } from "../ioc/city.module";
import { CartModule } from "../ioc/cart.module";
import { INestApplication } from "@nestjs/common";

export function doc(app: INestApplication) {
    const config = new DocumentBuilder()
        .setTitle("api documentaion")
        .setVersion("1.0")
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("docs", app, document);
}
