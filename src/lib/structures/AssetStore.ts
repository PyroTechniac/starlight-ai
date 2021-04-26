import * as Pieces from '@sapphire/pieces';
import { Asset } from './Asset.js';

export class AssetStore extends Pieces.Store<Asset> {
	public constructor() {
		super(Asset as any, { name: 'assets' });
	}
}
