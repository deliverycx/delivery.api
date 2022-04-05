export abstract class IGuestGenerateService {
    generate: () => Promise<string>;
}
